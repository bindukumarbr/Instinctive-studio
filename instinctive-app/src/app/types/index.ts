
export interface IClientListing {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    images?: string[];
    attributes?: Record<string, string | number | boolean | string[]>;
}

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    parent?: string;
}

export interface IFacet {
    [key: string]: Array<{ _id: string; count: number; }>;
}

export interface ICategoryAttributeSchema {
    _id: string;
    categorySlug: string;
    categoryName: string;
    attributes: Array<{
        key: string;
        name: string;
        type: 'string' | 'number' | 'boolean' | 'enum';
        options?: string[];
        required?: boolean;
    }>;
}

export interface ISearchResults {
    listings: IClientListing[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
    facets: IFacet;
    categoryAttributeSchema: ICategoryAttributeSchema[];
    limit: number;
    detectedCategorySlug?: string;
}