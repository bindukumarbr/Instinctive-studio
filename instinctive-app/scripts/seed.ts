import mongoose from 'mongoose';
import dbConnect from '../lib/mongodb';
import dotenv from 'dotenv';
import Category, { ICategory } from '../models/Category';
import Listing, { IListing } from '../models/Listing';

dotenv.config();

const seedData = async () => {
    await dbConnect();

    try {
        console.log('Seeding database with more diverse data (over 25 listings per category)...');

        // Clear existing data (optional)
        await Category.deleteMany({});
        await Listing.deleteMany({});
        console.log('Cleared existing data.');

        // Helper to get a random element from an array
        const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
        const getRandomBoolean = (): boolean => Math.random() > 0.5;
        const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
        const getRandomFloat = (min: number, max: number, decimals: number = 2): number =>
            parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

        // 1. Define and Create Categories with realistic attribute schemas
        const categoriesToCreate: Partial<ICategory>[] = [
            // 1. Mobiles, Computers (Focus on Laptops)
            {
                name: 'Laptops',
                slug: 'laptops',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Dell', 'HP', 'Lenovo', 'Apple', 'Acer', 'Asus', 'Microsoft', 'MSI'] },
                    { key: 'processor', name: 'Processor', type: 'enum', options: ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'] },
                    { key: 'ram_gb', name: 'RAM (GB)', type: 'enum', options: ['8', '16', '32', '64'] },
                    { key: 'storage_gb', name: 'Storage (GB)', type: 'enum', options: ['256', '512', '1000', '2000'] },
                    { key: 'screen_size_inch', name: 'Screen Size (inch)', type: 'enum', options: ['13.3', '14', '15.6', '16', '17.3'] },
                    { key: 'os', name: 'Operating System', type: 'enum', options: ['Windows', 'macOS', 'Linux', 'Chrome OS'] },
                    { key: 'touchscreen', name: 'Touchscreen', type: 'boolean' },
                ],
            },
            // 2. TV, Appliances, Electronics (Focus on Refrigerators)
            {
                name: 'Refrigerators',
                slug: 'refrigerators',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'Haier', 'Godrej', 'Panasonic'] },
                    { key: 'type', name: 'Type', type: 'enum', options: ['Single Door', 'Double Door', 'Side-by-Side', 'French Door', 'Bottom Freezer'] },
                    { key: 'capacity_liters', name: 'Capacity (Liters)', type: 'enum', options: ['180-250', '251-350', '351-450', '451-600', '601+'] },
                    { key: 'star_rating', name: 'Star Rating', type: 'enum', options: ['3 Star', '4 Star', '5 Star'] },
                    { key: 'inverter_compressor', name: 'Inverter Compressor', type: 'boolean' },
                    { key: 'dispenser', name: 'Water/Ice Dispenser', type: 'boolean' },
                ],
            },
            // 3. Men's Fashion (Focus on Men's Shirts)
            {
                name: 'Mens Shirts',
                slug: 'mens-shirts',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Arrow', 'Louis Philippe', 'Peter England', 'Allen Solly', 'US Polo Assn.', 'Raymond', 'Van Heusen'] },
                    { key: 'size', name: 'Size', type: 'enum', options: ['S', 'M', 'L', 'XL', 'XXL', '3XL'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['White', 'Blue', 'Black', 'Grey', 'Red', 'Green', 'Pink', 'Brown', 'Purple'] },
                    { key: 'material', name: 'Material', type: 'enum', options: ['Cotton', 'Linen', 'Polyester', 'Viscose', 'Denim'] },
                    { key: 'pattern', name: 'Pattern', type: 'enum', options: ['Solid', 'Striped', 'Checked', 'Printed', 'Floral'] },
                    { key: 'sleeve_type', name: 'Sleeve Type', type: 'enum', options: ['Full Sleeve', 'Half Sleeve'] },
                ],
            },
            // 4. Women's Fashion (Focus on Women's Dresses)
            {
                name: 'Womens Dresses',
                slug: 'womens-dresses',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Vero Moda', 'Only', 'Global Desi', 'W for Woman', 'Biba', 'Zara', 'H&M'] },
                    { key: 'size', name: 'Size', type: 'enum', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Black', 'Red', 'Blue', 'Pink', 'Yellow', 'Green', 'Purple', 'Orange', 'White'] },
                    { key: 'occasion', name: 'Occasion', type: 'enum', options: ['Casual', 'Party', 'Formal', 'Ethnic', 'Wedding'] },
                    { key: 'fabric', name: 'Fabric', type: 'enum', options: ['Cotton', 'Rayon', 'Georgette', 'Silk', 'Net', 'Chiffon', 'Lycra'] },
                    { key: 'length', name: 'Length', type: 'enum', options: ['Mini', 'Knee-Length', 'Midi', 'Maxi'] },
                ],
            },
            // 5. Home, Kitchen, Pets (Focus on Kitchen Appliances - Blenders)
            {
                name: 'Blenders',
                slug: 'blenders',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Prestige', 'Philips', 'Bajaj', 'Morphy Richards', 'Wonderchef', 'Usha', 'Sujata'] },
                    { key: 'type', name: 'Type', type: 'enum', options: ['Jars Blender', 'Hand Blender', 'Personal Blender', 'Immersion Blender'] },
                    { key: 'power_watts', name: 'Power (Watts)', type: 'enum', options: ['300-500', '501-750', '751-1000', '1001-1500', '1500+'] },
                    { key: 'jars_count', name: 'Number of Jars', type: 'enum', options: ['1', '2', '3', '4'] },
                    { key: 'speed_settings', name: 'Speed Settings', type: 'enum', options: ['2', '3', 'Variable'] },
                ],
            },
            // 6. Beauty, Health, Grocery (Focus on Skincare)
            {
                name: 'Skincare',
                slug: 'skincare',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Mamaearth', 'Lakme', 'Cetaphil', 'Nivea', 'Ponds', 'Himalaya', 'MCaffeine', 'Minimalist'] },
                    { key: 'product_type', name: 'Product Type', type: 'enum', options: ['Moisturizer', 'Face Wash', 'Serum', 'Sunscreen', 'Mask', 'Toner', 'Cleanser'] },
                    { key: 'skin_type', name: 'Skin Type', type: 'enum', options: ['Oily', 'Dry', 'Normal', 'Combination', 'Sensitive', 'Acne-Prone'] },
                    { key: 'volume_ml', name: 'Volume (ml)', type: 'enum', options: ['25', '50', '100', '150', '200', '400'] },
                    { key: 'spf_value', name: 'SPF Value', type: 'enum', options: ['0', '15', '30', '50', '50+'] }, // 0 for products without SPF
                ],
            },
            // 7. Sports, Fitness, Bags, Luggage (Focus on Sports Shoes)
            {
                name: 'Sports Shoes',
                slug: 'sports-shoes',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'ASICS', 'New Balance'] },
                    { key: 'size', name: 'Size (UK)', type: 'enum', options: ['5', '6', '7', '8', '9', '10', '11', '12'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Orange', 'Grey', 'Multi-color'] },
                    { key: 'sport', name: 'Sport', type: 'enum', options: ['Running', 'Training', 'Basketball', 'Cricket', 'Football', 'Gym'] },
                    { key: 'closure_type', name: 'Closure Type', type: 'enum', options: ['Lace-Up', 'Velcro', 'Slip-On'] },
                    { key: 'terrain', name: 'Terrain', type: 'enum', options: ['Road', 'Trail', 'Indoor'] },
                ],
            },
            // 8. Car, Motorbike, Industrial (Focus on Car Tyres)
            {
                name: 'Car Tyres',
                slug: 'car-tyres',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Apollo', 'MRF', 'Goodyear', 'Michelin', 'Bridgestone', 'CEAT', 'Pirelli'] },
                    { key: 'vehicle_type', name: 'Vehicle Type', type: 'enum', options: ['Car', 'SUV', 'Commercial Vehicle', 'Motorbike'] },
                    { key: 'tyre_size', name: 'Tyre Size', type: 'enum', options: ['185/65R15', '195/55R16', '205/60R16', '215/65R16', '225/50R17', '235/60R18'] },
                    { key: 'season', name: 'Season', type: 'enum', options: ['All Season', 'Summer', 'Winter'] },
                    { key: 'run_flat', name: 'Run Flat', type: 'boolean' },
                ],
            },
            // 9. Books (Focus on Fiction Books)
            {
                name: 'Fiction Books',
                slug: 'fiction-books',
                attributeSchema: [
                    { key: 'genre', name: 'Genre', type: 'enum', options: ['Thriller', 'Romance', 'Sci-Fi', 'Fantasy', 'Mystery', 'Historical Fiction', 'Literary Fiction', 'Horror'] },
                    { key: 'author', name: 'Author', type: 'enum', options: ['Colleen Hoover', 'Stephen King', 'J.K. Rowling', 'Agatha Christie', 'Brandon Sanderson', 'Ruskin Bond', 'Chetan Bhagat'] },
                    { key: 'format', name: 'Format', type: 'enum', options: ['Paperback', 'Hardcover', 'eBook', 'Audiobook'] },
                    { key: 'language', name: 'Language', type: 'enum', options: ['English', 'Hindi', 'Tamil', 'Marathi', 'Bengali'] },
                    { key: 'page_count', name: 'Page Count (approx)', type: 'enum', options: ['100-300', '301-500', '501-700', '700+'] },
                ],
            },
            // 10. Movies, Music & Video Games (Focus on Video Games)
            {
                name: 'Video Games',
                slug: 'video-games',
                attributeSchema: [
                    { key: 'platform', name: 'Platform', type: 'enum', options: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'Mobile'] },
                    { key: 'genre', name: 'Genre', type: 'enum', options: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Simulation', 'Puzzle', 'Fighting'] },
                    { key: 'publisher', name: 'Publisher', type: 'enum', options: ['EA', 'Ubisoft', 'Sony', 'Microsoft', 'Nintendo', 'Rockstar Games', 'Activision', 'CD Projekt Red'] },
                    { key: 'rating', name: 'Age Rating', type: 'enum', options: ['E', 'E10+', 'T', 'M', 'AO'] },
                    { key: 'multiplayer', name: 'Multiplayer Support', type: 'boolean' },
                ],
            },
        ];

        const createdCategories = await Category.insertMany(categoriesToCreate);
        const categoryMap = new Map(createdCategories.map(cat => [cat.slug, cat]));

        console.log('Categories created:', createdCategories.map(c => c.name).join(', '));

        const listingsToCreate: Partial<IListing>[] = [];
        // Expanded list of Indian cities for location diversity
        const locations = [
            'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad',
            'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
            'Puducherry', 'Goa', 'Chandigarh', 'Kochi'
        ];


        // Function to generate listings for a given category
        const generateListings = (categorySlug: string, count: number, priceMin: number, priceMax: number) => {
            const category = categoryMap.get(categorySlug)!;
            if (!category) {
                console.warn(`Category with slug '${categorySlug}' not found.`);
                return;
            }
            for (let i = 0; i < count; i++) {
                const attributes: Record<string, any> = {};
                for (const attrSchema of category.attributeSchema) {
                    if (attrSchema.type === 'boolean') {
                        attributes[attrSchema.key] = getRandomBoolean();
                    } else if (attrSchema.options && attrSchema.options.length > 0) {
                        attributes[attrSchema.key] = getRandom(attrSchema.options!);
                    }
                    // Note: If type is 'number' or 'string' without options, you'd add custom logic here
                }

                listingsToCreate.push({
                    title: `${category.name} Product ${i + 1} - ${attributes[category.attributeSchema[0].key]}`,
                    description: `High-quality ${category.name.toLowerCase()} with ${attributes[category.attributeSchema[1].key] || 'various features'} and ${attributes[category.attributeSchema[2].key] || 'great performance'}.`,
                    price: getRandomFloat(priceMin, priceMax),
                    location: getRandom(locations),
                    categoryId: category._id,
                    attributes: attributes,
                });
            }
        };

        // Generate listings for each category (25-30 listings per category)
        generateListings('laptops', 28, 35000, 180000); // More expensive laptops
        generateListings('refrigerators', 26, 18000, 85000);
        generateListings('mens-shirts', 30, 450, 4000);
        generateListings('womens-dresses', 30, 750, 6000);
        generateListings('blenders', 27, 1800, 12000);
        generateListings('skincare', 30, 150, 3500);
        generateListings('sports-shoes', 28, 1200, 10000);
        generateListings('car-tyres', 25, 2500, 18000);
        generateListings('fiction-books', 30, 120, 1000);
        generateListings('video-games', 25, 800, 7000);


        await Listing.insertMany(listingsToCreate);
        console.log(`Inserted ${listingsToCreate.length} listings across all categories.`); // Should be 260-300+

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        mongoose.connection.close();
    }
};

seedData();