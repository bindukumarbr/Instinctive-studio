import { NextResponse } from 'next/server';
import Listing from '../../../models/Listing';
import Category from '../../../models/Category';
import dbConnect from '@/lib/mongodb';

/**
 * Handles GET requests for the search API.
 * Searches and filters listings based on query, category, and dynamic attributes.
 * Provides pagination and facet aggregation.
 */
export async function GET(request: Request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q') || '';
    const categorySlug = searchParams.get('category') || '';
    const filtersParam = searchParams.get('filters');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    console.log(`\n--- API CALL START: /api/search ---`);
    console.log(`Received Params: q='${q}', categorySlug='${categorySlug}', filtersParam='${filtersParam}', page=${page}, limit=${limit}`);

    const matchStage: any = {};
    let categoryAttributeSchema: any[] = [];

    // 1. Build Category Match
    if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) {
            matchStage.categoryId = category._id;
            categoryAttributeSchema = category.attributeSchema;
            console.log(`Category found: ${categorySlug}. Adding categoryId to matchStage.`);
        } else {
            // Return empty results if category not found
            console.log(`Category slug '${categorySlug}' not found. Returning empty results.`);
            return NextResponse.json({
                listings: [],
                facets: {},
                categoryAttributeSchema: [],
                totalPages: 0,
                currentPage: 1,
                totalResults: 0
            });
        }
    } else {
        console.log('No categorySlug provided. Searching across all categories.');
    }
    console.log('matchStage after Category processing:', JSON.stringify(matchStage));

    // 2. Build Query (q) Match
    if (q) {
        // Add case-insensitive regex search on title and description
        matchStage.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ];
        console.log(`Query 'q' is present ('${q}'). Added $or text search to matchStage.`);
    } else {
        console.log(`Query 'q' is empty. Not adding $or text search to matchStage.`);
    }
    console.log('matchStage after Query (q) processing:', JSON.stringify(matchStage));

    // 3. Build Filters Match (from parsed JSON filtersParam)
    if (filtersParam) {
        try {
            const filters = JSON.parse(filtersParam);
            console.log('Parsed filters:', filters);

            for (const key in filters) {
                if (Object.prototype.hasOwnProperty.call(filters, key)) {
                    let value = filters[key];
                    const attrDef = categoryAttributeSchema.find(attr => attr.key === key);

                    if (attrDef) {
                        // Apply filter based on defined attribute type
                        if (attrDef.type === 'enum' || attrDef.type === 'multi_enum') {
                            matchStage[`attributes.${key}`] = { $in: Array.isArray(value) ? value : [value] };
                        } else if (attrDef.type === 'boolean') {
                            matchStage[`attributes.${key}`] = (value === 'true' || value === true);
                        }
                        // TODO: Add handling for 'number', 'range' types here
                    } else {
                        // Fallback for general attributes or if schema not found
                        matchStage[`attributes.${key}`] = Array.isArray(value) ? { $in: value } : value;
                    }
                }
            }
            console.log('matchStage after Filters processing:', JSON.stringify(matchStage));
        } catch (e) {
            console.error('Failed to parse filters JSON:', e);
        }
    } else {
        console.log('No filtersParam present.');
    }

    // --- AGGREGATION PIPELINE CONSTRUCTION ---
    const pipeline: any[] = [];

    // Add $match stage only if there are any conditions
    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
        console.log(`$match stage added to pipeline. Content: ${JSON.stringify(matchStage)}`);
    } else {
        console.log(`matchStage is empty. NOT adding $match stage.`);
    }

    // Add $facet stage for concurrent processing of listings, total count, and dynamic facets
    pipeline.push({
        $facet: {
            listings: [
                { $skip: (page - 1) * limit },
                { $limit: limit },
                { $project: { _id: 1, title: 1, description: 1, price: 1, location: 1, categoryId: 1, images: 1, attributes: 1, createdAt: 1, updatedAt: 1 } }
            ],
            totalCount: [
                { $count: 'count' }
            ],
            facets: [
                {
                    $group: {
                        _id: null,
                        ...categoryAttributeSchema.reduce((acc: any, attr: any) => {
                            if (attr.type === 'enum' || attr.type === 'multi_enum' || attr.type === 'boolean') {
                                acc[attr.key] = { $push: `$attributes.${attr.key}` };
                            }
                            return acc;
                        }, {})
                    }
                },
                {
                    $project: {
                        _id: 0,
                        ...categoryAttributeSchema.reduce((acc: any, attr: any) => {
                            if (attr.type === 'enum' || attr.type === 'multi_enum') {
                                acc[attr.key] = {
                                    $map: {
                                        input: { $setUnion: `$${attr.key}` },
                                        as: 'item',
                                        in: {
                                            _id: '$$item',
                                            count: {
                                                $size: {
                                                    $filter: {
                                                        input: `$${attr.key}`,
                                                        as: 'subItem',
                                                        cond: { $eq: ['$$subItem', '$$item'] }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                };
                            } else if (attr.type === 'boolean') {
                                acc[attr.key] = [
                                    { _id: true, count: { $size: { $filter: { input: `$${attr.key}`, as: 'subItem', cond: { $eq: ['$$subItem', true] } } } } },
                                    { _id: false, count: { $size: { $filter: { input: `$${attr.key}`, as: 'subItem', cond: { $eq: ['$$subItem', false] } } } } }
                                ];
                            }
                            return acc;
                        }, {})
                    }
                }
            ]
        }
    });

    try {
        console.log('\nExecuting MongoDB Aggregation Pipeline...');
        const aggregationResult = await Listing.aggregate(pipeline).exec();
        const data = aggregationResult[0] || { listings: [], totalCount: [], facets: [{}] };

        const totalResults = data.totalCount.length > 0 ? data.totalCount[0].count : 0;
        const totalPages = Math.ceil(totalResults / limit);

        // Normalize facets from array to object and filter out empty values
        const normalizedFacets: Record<string, Array<{ _id: string | boolean | number; count: number }>> = {};
        if (data.facets && data.facets.length > 0) {
            const rawFacets = data.facets[0];
            for (const key in rawFacets) {
                if (Object.prototype.hasOwnProperty.call(rawFacets, key)) {
                    normalizedFacets[key] = rawFacets[key].filter((item: any) =>
                        item._id !== null && item._id !== undefined && item._id !== ''
                    );
                }
            }
        }

        console.log(`\n--- API RESPONSE SUMMARY ---`);
        console.log(`Listings Returned: ${data.listings.length}`);
        console.log(`Total Results Matching Criteria: ${totalResults}`);
        console.log(`Current Page: ${page}, Total Pages: ${totalPages}`);
        console.log('--- API CALL END ---\n');

        return NextResponse.json({
            listings: data.listings,
            facets: normalizedFacets,
            categoryAttributeSchema: categoryAttributeSchema,
            totalPages,
            currentPage: page,
            totalResults
        });

    } catch (error) {
        console.error('\n--- AGGREGATION ERROR ---');
        console.error('An error occurred during MongoDB aggregation:', error);
        console.error('--- ERROR END ---\n');
        return NextResponse.json({ message: 'Internal server error during search' }, { status: 500 });
    }
}