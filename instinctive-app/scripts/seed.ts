// seed.ts
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import dotenv from 'dotenv';
import Category, { ICategory } from '../src/models/Category';
import Listing, { IListing } from '../src/models/Listing';


dotenv.config({path: "../env"});



const seedData = async () => {
    await dbConnect();

    try {
        console.log('Seeding database with more diverse and realistic data (including categories)...');

        // Clear existing data (optional, but good for fresh seeds)
        await Category.deleteMany({});
        await Listing.deleteMany({});
        console.log('Cleared existing data.');

        // Helper functions
        const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
        const getRandomBoolean = (): boolean => Math.random() > 0.5;
        const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
        const getRandomFloat = (min: number, max: number, decimals: number = 2): number =>
            parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

        // Placeholder image generator (using placehold.co for better variety)
        const getPlaceholderImageUrl = (width: number, height: number, category: string, id: number) => {
            const colors = ['e0e0e0', 'd1e7dd', 'cfe2ff', 'f8d7da', 'fff3cd', 'e2e3e5'];
            const fgColors = ['555555', '0f5132', '084298', '842029', '664d03', '495057'];
            const randomColor = getRandom(colors);
            const randomFgColor = getRandom(fgColors);
            return `https://placehold.co/${width}x${height}/${randomColor}/${randomFgColor}/png?text=${encodeURIComponent(category.replace(/ /g, '_'))}_${id}`;
        };


        // Generic titles/names for categories where specific product names aren't in attributes
        const genericBookTitles = [
            'The Midnight Library', 'Project Hail Mary', 'Where the Crawdads Sing', 'Circe', 'The Henna Artist',
            'Atomic Habits', 'The Alchemist', 'Educated', 'Sapiens', 'The Silent Patient', 'The Palace of Illusions',
            'Sita: Warrior of Mithila', 'The Immortals of Meluha', 'Five Point Someone', 'Revolution 2020'
        ];
        const genericGameTitles = [
            'Cyberpunk 2077', 'Elden Ring', 'God of War Ragnarök', 'The Legend of Zelda: Tears of the Kingdom',
            'Baldur\'s Gate 3', 'Red Dead Redemption 2', 'Grand Theft Auto V', 'Apex Legends', 'Valorant', 'Minecraft',
            'FIFA 25', 'Call of Duty: Modern Warfare III', 'Assassin\'s Creed Mirage', 'Forza Horizon 5'
        ];
        const genericMobileModels = [
            'Pro Max 15', 'Ultra S24', 'Pixel 8 Pro', 'OnePlus 12', 'Redmi Note 13 Pro', 'iPhone SE 2024', 'Galaxy A55', 'Mi 14'
        ];


        const categoriesToCreate: Partial<ICategory>[] = [
            // --- ELECTRONICS ---
            {
                name: 'Mobiles',
                slug: 'mobiles',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Google', 'Oppo', 'Vivo', 'Realme'] },
                    { key: 'ram_gb', name: 'RAM (GB)', type: 'enum', options: ['4', '6', '8', '12', '16'] },
                    { key: 'storage_gb', name: 'Storage (GB)', type: 'enum', options: ['64', '128', '256', '512', '1000'] },
                    { key: 'screen_size_inch', name: 'Screen Size (inch)', type: 'enum', options: ['6.1', '6.5', '6.7', '6.8', '6.9'] },
                    { key: 'camera_mp', name: 'Camera (MP)', type: 'enum', options: ['12', '48', '64', '108', '200'] },
                    { key: 'battery_mah', name: 'Battery (mAh)', type: 'enum', options: ['3000-4000', '4001-5000', '5001+'] },
                    { key: 'os', name: 'Operating System', type: 'enum', options: ['Android', 'iOS'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Black', 'Blue', 'White', 'Green', 'Purple', 'Silver', 'Gold'] },
                ],
            },
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
                    { key: 'graphics_card', name: 'Graphics Card', type: 'enum', options: ['Integrated', 'NVIDIA GeForce RTX 3050', 'NVIDIA GeForce RTX 4060', 'AMD Radeon RX 6600M'] },
                ],
            },
            {
                name: 'Headphones',
                slug: 'headphones',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Sony', 'Bose', 'JBL', 'Sennheiser', 'Audio-Technica', 'Apple', 'Skullcandy', 'Boat', 'Marshall'] },
                    { key: 'type', name: 'Type', type: 'enum', options: ['Over-ear', 'On-ear', 'In-ear', 'True Wireless'] },
                    { key: 'connectivity', name: 'Connectivity', type: 'enum', options: ['Wireless', 'Wired', 'Both'] },
                    { key: 'noise_cancellation', name: 'Noise Cancellation', type: 'boolean' },
                    { key: 'playback_hours', name: 'Playback (Hours)', type: 'enum', options: ['5-10', '11-20', '21-30', '30+'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Black', 'White', 'Blue', 'Red', 'Grey'] },
                ],
            },

            // --- HOME APPLIANCES ---
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
                    { key: 'color', name: 'Color', type: 'enum', options: ['Silver', 'Black', 'Blue', 'Red', 'White'] },
                ],
            },
            {
                name: 'Washing Machines',
                slug: 'washing-machines',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'IFB', 'Godrej', 'Panasonic'] },
                    { key: 'type', name: 'Type', type: 'enum', options: ['Top Load', 'Front Load', 'Semi-Automatic'] },
                    { key: 'capacity_kg', name: 'Capacity (kg)', type: 'enum', options: ['6-7', '7.1-8', '8.1-9', '9.1-10', '10+'] },
                    { key: 'load_type', name: 'Loading Type', type: 'enum', options: ['Top Load', 'Front Load'] }, // Redundant but common to list both 'type' and 'load_type' in UI
                    { key: 'inverter_motor', name: 'Inverter Motor', type: 'boolean' },
                    { key: 'wash_programs', name: 'Wash Programs', type: 'enum', options: ['6-8', '9-12', '12+'] },
                ],
            },
            {
                name: 'Blenders',
                slug: 'blenders',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Prestige', 'Philips', 'Bajaj', 'Morphy Richards', 'Wonderchef', 'Usha', 'Sujata', 'NutriBullet'] },
                    { key: 'type', name: 'Type', type: 'enum', options: ['Mixer Grinder', 'Hand Blender', 'Personal Blender', 'Immersion Blender', 'Juicer Mixer Grinder'] },
                    { key: 'power_watts', name: 'Power (Watts)', type: 'enum', options: ['300-500', '501-750', '751-1000', '1001-1500', '1500+'] },
                    { key: 'jars_count', name: 'Number of Jars', type: 'enum', options: ['1', '2', '3', '4'] },
                    { key: 'speed_settings', name: 'Speed Settings', type: 'enum', options: ['2', '3', 'Variable'] },
                    { key: 'material', name: 'Jar Material', type: 'enum', options: ['Stainless Steel', 'Polycarbonate', 'Glass'] },
                ],
            },

            // --- FASHION ---
            {
                name: 'Mens Shirts',
                slug: 'mens-shirts',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Arrow', 'Louis Philippe', 'Peter England', 'Allen Solly', 'US Polo Assn.', 'Raymond', 'Van Heusen', 'Puma', 'Tommy Hilfiger'] },
                    { key: 'size', name: 'Size', type: 'enum', options: ['S', 'M', 'L', 'XL', 'XXL', '3XL'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['White', 'Blue', 'Black', 'Grey', 'Red', 'Green', 'Pink', 'Brown', 'Purple', 'Navy', 'Olive', 'Maroon'] },
                    { key: 'material', name: 'Material', type: 'enum', options: ['Cotton', 'Linen', 'Polyester', 'Viscose', 'Denim', 'Rayon Blend'] },
                    { key: 'pattern', name: 'Pattern', type: 'enum', options: ['Solid', 'Striped', 'Checked', 'Printed', 'Floral', 'Abstract', 'Paisley'] },
                    { key: 'sleeve_type', name: 'Sleeve Type', type: 'enum', options: ['Full Sleeve', 'Half Sleeve', 'Roll-up Sleeve'] },
                    { key: 'fit', name: 'Fit', type: 'enum', options: ['Regular Fit', 'Slim Fit', 'Comfort Fit', 'Tailored Fit'] },
                ],
            },
            {
                name: 'Mens Jeans',
                slug: 'mens-jeans',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Levi\'s', 'Pepe Jeans', 'Spykar', 'Killer', 'Wrangler', 'Lee', 'Flying Machine', 'Denim Hub', 'Roadster'] },
                    { key: 'size', name: 'Size (Waist)', type: 'enum', options: ['28', '30', '32', '34', '36', '38', '40'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Blue', 'Black', 'Grey', 'Dark Blue', 'Light Blue', 'Olive Green'] },
                    { key: 'fit', name: 'Fit', type: 'enum', options: ['Slim Fit', 'Regular Fit', 'Skinny Fit', 'Straight Fit', 'Relaxed Fit'] },
                    { key: 'distress', name: 'Distress', type: 'boolean' },
                    { key: 'wash', name: 'Wash', type: 'enum', options: ['Light', 'Medium', 'Dark', 'Clean', 'Acid Wash'] },
                ],
            },
            {
                name: 'Womens Dresses',
                slug: 'womens-dresses',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Vero Moda', 'Only', 'Global Desi', 'W for Woman', 'Biba', 'Zara', 'H&M', 'Fabindia', 'Forever 21'] },
                    { key: 'size', name: 'Size', type: 'enum', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Black', 'Red', 'Blue', 'Pink', 'Yellow', 'Green', 'Purple', 'Orange', 'White', 'Maroon', 'Teal', 'Navy'] },
                    { key: 'occasion', name: 'Occasion', type: 'enum', options: ['Casual', 'Party', 'Formal', 'Ethnic', 'Wedding', 'Daily Wear'] },
                    { key: 'fabric', name: 'Fabric', type: 'enum', options: ['Cotton', 'Rayon', 'Georgette', 'Silk', 'Net', 'Chiffon', 'Lycra', 'Polyester', 'Crepe'] },
                    { key: 'length', name: 'Length', type: 'enum', options: ['Mini', 'Knee-Length', 'Midi', 'Maxi', 'Ankle-Length'] },
                    { key: 'neck_type', name: 'Neck Type', type: 'enum', options: ['Round Neck', 'V-Neck', 'Boat Neck', 'Collar Neck', 'Off Shoulder', 'Square Neck', 'Halter Neck'] },
                ],
            },
            {
                name: 'Womens Kurtas',
                slug: 'womens-kurtas',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['W for Woman', 'Biba', 'Global Desi', 'Libas', 'Fabindia', 'Aurelia', 'Manyavar', 'Melange'] },
                    { key: 'size', name: 'Size', type: 'enum', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['White', 'Blue', 'Black', 'Red', 'Green', 'Yellow', 'Pink', 'Orange', 'Beige', 'Maroon', 'Teal'] },
                    { key: 'material', name: 'Material', type: 'enum', options: ['Cotton', 'Rayon', 'Silk Blend', 'Chiffon', 'Viscose', 'Linen Blend', 'Khadi'] },
                    { key: 'pattern', name: 'Pattern', type: 'enum', options: ['Solid', 'Printed', 'Embroidered', 'Embellished', 'Floral', 'Geometric', 'Striped'] },
                    { key: 'sleeve_length', name: 'Sleeve Length', type: 'enum', options: ['Sleeveless', 'Short Sleeve', '3/4 Sleeve', 'Full Sleeve'] },
                    { key: 'neck_type', name: 'Neck Type', type: 'enum', options: ['Round Neck', 'V-Neck', 'Mandarin Collar', 'Boat Neck', 'Keyhole Neck'] },
                ],
            },

            // --- BEAUTY & PERSONAL CARE ---
            {
                name: 'Skincare',
                slug: 'skincare',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Mamaearth', 'Lakme', 'Cetaphil', 'Nivea', 'Ponds', 'Himalaya', 'MCaffeine', 'Minimalist', 'Lotus Herbals', 'The Ordinary', 'Kiehl\'s'] },
                    { key: 'product_type', name: 'Product Type', type: 'enum', options: ['Moisturizer', 'Face Wash', 'Serum', 'Sunscreen', 'Mask', 'Toner', 'Cleanser', 'Night Cream', 'Eye Cream', 'Lip Balm'] },
                    { key: 'skin_type', name: 'Skin Type', type: 'enum', options: ['Oily', 'Dry', 'Normal', 'Combination', 'Sensitive', 'Acne-Prone'] },
                    { key: 'volume_ml', name: 'Volume (ml)', type: 'enum', options: ['15', '25', '50', '100', '150', '200', '400', '500'] },
                    { key: 'spf_value', name: 'SPF Value', type: 'enum', options: ['0', '15', '20', '30', '40', '50', '50+'] }, // 0 for products without SPF
                    { key: 'concern', name: 'Concern', type: 'enum', options: ['Acne', 'Dullness', 'Anti-aging', 'Hydration', 'Pigmentation', 'Sun Protection', 'Dark Circles', 'Fine Lines'] },
                    { key: 'formulation', name: 'Formulation', type: 'enum', options: ['Cream', 'Gel', 'Lotion', 'Oil', 'Foam', 'Liquid'] },
                ],
            },
            {
                name: 'Haircare',
                slug: 'haircare',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['L\'Oreal', 'Pantene', 'Dove', 'Himalaya', 'Mamaearth', 'Tresemme', 'Head & Shoulders', 'Biotique', 'Forest Essentials', 'Kérastase'] },
                    { key: 'product_type', name: 'Product Type', type: 'enum', options: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask', 'Serum', 'Hair Gel', 'Hair Color', 'Hair Spray'] },
                    { key: 'hair_type', name: 'Hair Type', type: 'enum', options: ['Oily Scalp', 'Dry Scalp', 'Normal Hair', 'Damaged Hair', 'Color Treated Hair', 'Dandruff Prone', 'Frizzy Hair', 'Thinning Hair'] },
                    { key: 'volume_ml', name: 'Volume (ml)', type: 'enum', options: ['100', '180', '200', '300', '400', '500', '600', '750'] },
                    { key: 'concern', name: 'Concern', type: 'enum', options: ['Hairfall', 'Dandruff', 'Dryness', 'Frizz', 'Split Ends', 'Volume', 'Shine', 'Scalp Health'] },
                    { key: 'ingredient_preference', name: 'Ingredient Preference', type: 'enum', options: ['Sulfate-Free', 'Paraben-Free', 'Natural', 'Ayurvedic', 'Keratin'] },
                ],
            },

            // --- SPORTS & FITNESS ---
            {
                name: 'Sports Shoes',
                slug: 'sports-shoes',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Skechers', 'ASICS', 'New Balance', 'Bata', 'Campus', 'Woodland'] },
                    { key: 'size_uk', name: 'Size (UK)', type: 'enum', options: ['5', '6', '7', '8', '9', '10', '11', '12'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Orange', 'Grey', 'Multi-color', 'Yellow', 'Pink', 'Brown'] },
                    { key: 'sport', name: 'Sport', type: 'enum', options: ['Running', 'Training', 'Basketball', 'Cricket', 'Football', 'Gym', 'Walking', 'Tennis', 'Badminton'] },
                    { key: 'closure_type', name: 'Closure Type', type: 'enum', options: ['Lace-Up', 'Velcro', 'Slip-On'] },
                    { key: 'terrain', name: 'Terrain', type: 'enum', options: ['Road', 'Trail', 'Indoor', 'Outdoor'] },
                    { key: 'material', name: 'Outer Material', type: 'enum', options: ['Mesh', 'Synthetic', 'Leather', 'Knitted', 'Fabric'] },
                ],
            },
            {
                name: 'Fitness Equipment',
                slug: 'fitness-equipment',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Decathlon', 'Cockatoo', 'Kore', 'Cultsport', 'Durafit', 'PowerMax', 'Lifelong', 'Fitkit'] },
                    { key: 'product_type', name: 'Product Type', type: 'enum', options: ['Treadmill', 'Exercise Bike', 'Dumbbells Set', 'Yoga Mat', 'Resistance Bands', 'Weight Bench', 'Jump Rope', 'Gym Ball', 'Pull-up Bar'] },
                    { key: 'max_weight_capacity_kg', name: 'Max Weight Capacity (kg)', type: 'enum', options: ['90-100', '101-120', '121-150', '150+', 'N/A'] }, // N/A for mats/bands
                    { key: 'foldable', name: 'Foldable', type: 'boolean' },
                    { key: 'material', name: 'Material', type: 'enum', options: ['Steel', 'Rubber', 'PVC', 'Cast Iron', 'Neoprene', 'Foam'] },
                ],
            },

            // --- AUTOMOTIVE ---
            {
                name: 'Car Tyres',
                slug: 'car-tyres',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Apollo', 'MRF', 'Goodyear', 'Michelin', 'Bridgestone', 'CEAT', 'Pirelli', 'Continental', 'Dunlop'] },
                    { key: 'vehicle_type', name: 'Vehicle Type', type: 'enum', options: ['Car', 'SUV', 'Commercial Vehicle', 'Motorbike'] },
                    { key: 'tyre_size', name: 'Tyre Size', type: 'enum', options: ['185/65R15', '195/55R16', '205/60R16', '215/65R16', '225/50R17', '235/60R18', '175/70R13', '265/60R18', '145/80R12'] },
                    { key: 'season', name: 'Season', type: 'enum', options: ['All Season', 'Summer', 'Winter'] },
                    { key: 'run_flat', name: 'Run Flat', type: 'boolean' },
                    { key: 'warranty_years', name: 'Warranty (Years)', type: 'enum', options: ['2', '3', '4', '5'] },
                ],
            },
            {
                name: 'Car Accessories',
                slug: 'car-accessories',
                attributeSchema: [
                    { key: 'product_type', name: 'Product Type', type: 'enum', options: ['Car Charger', 'Seat Cover', 'Floor Mat', 'Car Perfume', 'Tyre Inflator', 'Dash Cam', 'Steering Wheel Cover', 'Car Vacuum Cleaner', 'Scratch Remover'] },
                    { key: 'car_model_compatibility', name: 'Car Model Compatibility', type: 'enum', options: ['Universal', 'Maruti Swift', 'Hyundai Creta', 'Mahindra Thar', 'Tata Nexon', 'Honda City', 'Toyota Fortuner', 'Kia Seltos', 'Hyundai i20', 'Maruti Alto'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Black', 'Grey', 'Beige', 'Red', 'Brown', 'Blue', 'Carbon Fiber Look'] },
                    { key: 'material', name: 'Material', type: 'enum', options: ['Plastic', 'Leatherette', 'Rubber', 'Fabric', 'Metal', 'Microfiber'] },
                ],
            },

            // --- BOOKS, MOVIES & GAMING ---
            {
                name: 'Fiction Books',
                slug: 'fiction-books',
                attributeSchema: [
                    { key: 'genre', name: 'Genre', type: 'enum', options: ['Thriller', 'Romance', 'Sci-Fi', 'Fantasy', 'Mystery', 'Historical Fiction', 'Literary Fiction', 'Horror', 'Young Adult', 'Classics'] },
                    { key: 'author', name: 'Author', type: 'enum', options: ['Colleen Hoover', 'Stephen King', 'J.K. Rowling', 'Agatha Christie', 'Brandon Sanderson', 'Ruskin Bond', 'Chetan Bhagat', 'Amish Tripathi', 'Durjoy Datta', 'Jane Austen', 'George Orwell'] },
                    { key: 'format', name: 'Format', type: 'enum', options: ['Paperback', 'Hardcover', 'eBook', 'Audiobook'] },
                    { key: 'language', name: 'Language', type: 'enum', options: ['English', 'Hindi', 'Tamil', 'Marathi', 'Bengali', 'Malayalam', 'Gujarati'] },
                    { key: 'page_count', name: 'Page Count (approx)', type: 'enum', options: ['100-300', '301-500', '501-700', '700+'] },
                    { key: 'publisher', name: 'Publisher', type: 'enum', options: ['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Hachette India', 'Rupa Publications', 'Westland Books'] },
                ],
            },
            {
                name: 'Non-Fiction Books',
                slug: 'non-fiction-books',
                attributeSchema: [
                    { key: 'genre', name: 'Genre', type: 'enum', options: ['Self-Help', 'Biography', 'History', 'Science', 'Business', 'Cooking', 'Travel', 'Philosophy', 'Art', 'Health'] },
                    { key: 'author', name: 'Author', type: 'enum', options: ['James Clear', 'Yuval Noah Harari', 'Michelle Obama', 'Bill Gates', 'Robin Sharma', 'Devdutt Pattanaik', 'Subroto Bagchi', 'Viktor Frankl', 'Stephen Hawking'] },
                    { key: 'format', name: 'Format', type: 'enum', options: ['Paperback', 'Hardcover', 'eBook', 'Audiobook'] },
                    { key: 'language', name: 'Language', type: 'enum', options: ['English', 'Hindi', 'Marathi', 'Bengali'] },
                    { key: 'page_count', name: 'Page Count (approx)', type: 'enum', options: ['150-350', '351-550', '550+'] },
                    { key: 'publisher', name: 'Publisher', type: 'enum', options: ['Penguin Random House', 'HarperCollins', 'Simon & Schuster', 'Bloomsbury', 'Hachette India', 'Jaico Publishing House'] },
                ],
            },
            {
                name: 'Video Games',
                slug: 'video-games',
                attributeSchema: [
                    { key: 'platform', name: 'Platform', type: 'enum', options: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'Mobile'] },
                    { key: 'genre', name: 'Genre', type: 'enum', options: ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Simulation', 'Puzzle', 'Fighting', 'Racing', 'Horror', 'Casual', 'FPS'] },
                    { key: 'publisher', name: 'Publisher', type: 'enum', options: ['EA', 'Ubisoft', 'Sony', 'Microsoft', 'Nintendo', 'Rockstar Games', 'Activision', 'CD Projekt Red', 'Capcom', 'Bandai Namco', 'Square Enix', 'Epic Games'] },
                    { key: 'rating', name: 'Age Rating', type: 'enum', options: ['E', 'E10+', 'T', 'M', 'AO'] },
                    { key: 'multiplayer', name: 'Multiplayer Support', type: 'boolean' },
                    { key: 'release_year', name: 'Release Year', type: 'enum', options: ['2020', '2021', '2022', '2023', '2024', '2025'] },
                    { key: 'condition', name: 'Condition', type: 'enum', options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
                ],
            },

            // --- HOME & FURNITURE ---
            {
                name: 'Sofas',
                slug: 'sofas',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Pepperfry', 'Urban Ladder', 'Wakefit', 'Home Centre', 'Nilkamal', 'Royaloak', 'Durian', 'Furlenco'] },
                    { key: 'seating_capacity', name: 'Seating Capacity', type: 'enum', options: ['1-seater', '2-seater', '3-seater', 'L-shape', 'Sectional'] },
                    { key: 'material', name: 'Material', type: 'enum', options: ['Fabric', 'Leatherette', 'Velvet', 'Wood', 'Metal', 'Leather'] },
                    { key: 'color', name: 'Color', type: 'enum', options: ['Grey', 'Blue', 'Brown', 'Beige', 'Red', 'Green', 'Black', 'Cream', 'Navy'] },
                    { key: 'storage_available', name: 'Storage Available', type: 'boolean' },
                    { key: 'style', name: 'Style', type: 'enum', options: ['Modern', 'Contemporary', 'Traditional', 'Mid-Century', 'Chesterfield'] },
                ],
            },
            {
                name: 'Beds',
                slug: 'beds',
                attributeSchema: [
                    { key: 'brand', name: 'Brand', type: 'enum', options: ['Pepperfry', 'Urban Ladder', 'Wakefit', 'Home Centre', 'Nilkamal', 'Kurlon', 'Sleepwell', 'Durian'] },
                    { key: 'bed_size', name: 'Bed Size', type: 'enum', options: ['Single', 'Diwan', 'Queen', 'King', 'Super King'] },
                    { key: 'material', name: 'Material', type: 'enum', options: ['Engineered Wood', 'Solid Wood', 'Metal', 'Upholstered', 'Wrought Iron'] },
                    { key: 'storage_type', name: 'Storage Type', type: 'enum', options: ['No Storage', 'Box Storage', 'Hydraulic Storage', 'Drawer Storage'] },
                    { key: 'mattress_included', name: 'Mattress Included', type: 'boolean' },
                    { key: 'headboard_type', name: 'Headboard Type', type: 'enum', options: ['Panel', 'Slat', 'Upholstered', 'Open-Frame', 'No Headboard'] },
                ],
            },
        ];

        const createdCategories = await Category.insertMany(categoriesToCreate);
        const categoryMap = new Map(createdCategories.map(cat => [cat.slug, cat]));

        console.log('Categories created:', createdCategories.map(c => c.name).join(', '));

        const listingsToCreate: Partial<IListing>[] = [];
        const locations = [
            'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad',
            'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
            'Puducherry', 'Goa', 'Chandigarh', 'Kochi', 'Surat', 'Patna', 'Srinagar', 'Mysuru', 'Coimbatore', 'Gurugram'
        ];

        // Function to generate listings for a given category
        const generateListings = (categorySlug: string, count: number, priceMin: number, priceMax: number) => {
            const category = categoryMap.get(categorySlug)!;
            if (!category) {
                console.warn(`Category with slug '${categorySlug}' not found. Skipping listing generation.`);
                return;
            }

            for (let i = 0; i < count; i++) {
                const attributes = new Map<string, any>();

                for (const attrSchema of category.attributeSchema) {
                    if (attrSchema.type === 'boolean') {
                        attributes.set(attrSchema.key, getRandomBoolean());
                    } else if (attrSchema.options && attrSchema.options.length > 0) {
                        attributes.set(attrSchema.key, getRandom(attrSchema.options!));
                    }
                }

                let title: string;
                let description: string;
                let imageUrl: string;

                // Generate more realistic titles and descriptions based on category
                // Use attributes.get() now that it's a Map
                switch (categorySlug) {
                    case 'mobiles':
                        const mobileBrand = attributes.get('brand');
                        const mobileStorage = attributes.get('storage_gb');
                        const mobileColor = attributes.get('color');
                        title = `${mobileBrand} ${getRandom(genericMobileModels)} ${mobileStorage}GB ${mobileColor ? `(${mobileColor})` : ''}`;
                        description = `Experience cutting-edge technology with the new ${mobileBrand} mobile. Featuring ${attributes.get('ram_gb')}GB RAM, ${mobileStorage}GB storage, a stunning ${attributes.get('screen_size_inch')}-inch display, and a powerful ${attributes.get('camera_mp')}MP camera. Long-lasting ${attributes.get('battery_mah')} battery life. Runs on ${attributes.get('os')}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, mobileBrand, i);
                        break;
                    case 'laptops':
                        const laptopBrand = attributes.get('brand');
                        const laptopProcessor = attributes.get('processor');
                        const laptopRAM = attributes.get('ram_gb');
                        title = `${laptopBrand} ${laptopProcessor} Laptop with ${laptopRAM}GB RAM`;
                        description = `Powerful ${laptopBrand} laptop featuring ${laptopProcessor} processor, ${laptopRAM}GB RAM, and ${attributes.get('storage_gb')}GB SSD. Perfect for work and entertainment. Screen size: ${attributes.get('screen_size_inch')} inches, OS: ${attributes.get('os')}. ${attributes.get('touchscreen') ? 'Includes touchscreen display.' : ''} Equipped with ${attributes.get('graphics_card')} graphics.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, laptopBrand, i);
                        break;
                    case 'headphones':
                        const headphoneBrand = attributes.get('brand');
                        const headphoneType = attributes.get('type');
                        const headphoneConnectivity = attributes.get('connectivity');
                        const nc = attributes.get('noise_cancellation') ? 'active noise cancellation' : 'clear sound quality';
                        title = `${headphoneBrand} ${headphoneType} Headphones - ${headphoneConnectivity} ${nc.includes('noise cancellation') ? 'Noise Cancelling' : ''}`;
                        description = `Immersive audio experience with ${headphoneBrand} ${headphoneType} headphones. ${headphoneConnectivity} connectivity and ${nc}. Up to ${attributes.get('playback_hours')} hours playback. Color: ${attributes.get('color')}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, headphoneBrand, i);
                        break;
                    case 'refrigerators':
                        const fridgeBrand = attributes.get('brand');
                        const fridgeType = attributes.get('type');
                        const fridgeCapacity = attributes.get('capacity_liters');
                        const fridgeRating = attributes.get('star_rating');
                        title = `${fridgeBrand} ${fridgeType} Refrigerator (${fridgeCapacity}L, ${fridgeRating})`;
                        description = `Energy-efficient ${fridgeBrand} ${fridgeType} refrigerator with ${fridgeCapacity} liters capacity and ${fridgeRating} rating. Features ${attributes.get('inverter_compressor') ? 'Inverter Compressor' : 'Standard Compressor'} and ${attributes.get('dispenser') ? 'Water/Ice Dispenser' : 'no dispenser'}. Stylish ${attributes.get('color')} finish.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, fridgeBrand, i);
                        break;
                    case 'washing-machines':
                        const wmBrand = attributes.get('brand');
                        const wmLoadType = attributes.get('load_type');
                        const wmCapacity = attributes.get('capacity_kg');
                        title = `${wmBrand} ${wmLoadType} Washing Machine (${wmCapacity}kg)`;
                        description = `Advanced ${wmBrand} washing machine with ${wmCapacity}kg capacity. ${wmLoadType} type and ${attributes.get('wash_programs')} wash programs. ${attributes.get('inverter_motor') ? 'Equipped with Inverter Motor for efficiency.' : 'Reliable performance.'}`;
                        imageUrl = getPlaceholderImageUrl(400, 300, wmBrand, i);
                        break;
                    case 'blenders':
                        const blenderBrand = attributes.get('brand');
                        const blenderType = attributes.get('type');
                        const blenderPower = attributes.get('power_watts');
                        title = `${blenderBrand} ${blenderType} Blender (${blenderPower}W)`;
                        description = `High-performance ${blenderBrand} blender with ${blenderPower} Watts power and ${attributes.get('jars_count')} jars. Features ${attributes.get('speed_settings')} speed settings for versatile blending. Jar material: ${attributes.get('material')}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, blenderBrand, i);
                        break;
                    case 'mens-shirts':
                        const shirtBrand = attributes.get('brand');
                        const shirtPattern = attributes.get('pattern');
                        const shirtColor = attributes.get('color');
                        const shirtSize = attributes.get('size');
                        title = `${shirtBrand} Men's ${shirtPattern} ${shirtColor} Shirt (${shirtSize}, ${attributes.get('fit')} Fit)`;
                        description = `Stylish ${shirtBrand} shirt made from ${attributes.get('material')} with a ${attributes.get('sleeve_type')} sleeve. Perfect for ${getRandom(['casual', 'formal', 'party'])} occasions.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, shirtBrand, i);
                        break;
                    case 'mens-jeans':
                        const jeansBrand = attributes.get('brand');
                        const jeansFit = attributes.get('fit');
                        const jeansSize = attributes.get('size');
                        const jeansColor = attributes.get('color');
                        title = `${jeansBrand} Men's ${jeansFit} Fit Jeans (${jeansSize} Waist) - ${jeansColor}`;
                        description = `Trendy ${jeansBrand} jeans in ${jeansColor} wash and ${jeansFit} fit. ${attributes.get('distress') ? 'Features light distressing.' : 'Classic and versatile.'}`;
                        imageUrl = getPlaceholderImageUrl(400, 300, jeansBrand, i);
                        break;
                    case 'womens-dresses':
                        const dressBrand = attributes.get('brand');
                        const dressLength = attributes.get('length');
                        const dressOccasion = attributes.get('occasion');
                        const dressSize = attributes.get('size');
                        title = `${dressBrand} Women's ${dressLength} ${dressOccasion} Dress (${dressSize})`;
                        description = `Elegant ${dressBrand} dress crafted from ${attributes.get('fabric')} in a beautiful ${attributes.get('color')} shade with a ${attributes.get('neck_type')} neck. Ideal for ${dressOccasion} wear.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, dressBrand, i);
                        break;
                    case 'womens-kurtas':
                        const kurtaBrand = attributes.get('brand');
                        const kurtaPattern = attributes.get('pattern');
                        const kurtaSize = attributes.get('size');
                        const kurtaColor = attributes.get('color');
                        title = `${kurtaBrand} Women's ${kurtaPattern} Kurta (${kurtaSize}) - ${kurtaColor}`;
                        description = `Comfortable and stylish ${kurtaBrand} kurta made from ${attributes.get('material')}. Features a beautiful ${kurtaPattern} and ${attributes.get('sleeve_length')} sleeves with a ${attributes.get('neck_type')} neckline.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, kurtaBrand, i);
                        break;
                    case 'skincare':
                        const skincareBrand = attributes.get('brand');
                        const skincareProductType = attributes.get('product_type');
                        const skincareSkinType = attributes.get('skin_type');
                        const skincareVolume = attributes.get('volume_ml');
                        title = `${skincareBrand} ${skincareProductType} for ${skincareSkinType} Skin (${skincareVolume}ml)`;
                        description = `Premium ${skincareBrand} ${skincareProductType} formulated for ${skincareSkinType} skin to address ${attributes.get('concern')}. ${attributes.get('spf_value') !== '0' ? `Contains SPF ${attributes.get('spf_value')}.` : 'No SPF.'} ${attributes.get('formulation')} formulation.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, skincareBrand, i);
                        break;
                    case 'haircare':
                        const haircareBrand = attributes.get('brand');
                        const haircareProductType = attributes.get('product_type');
                        const haircareHairType = attributes.get('hair_type');
                        const haircareVolume = attributes.get('volume_ml');
                        title = `${haircareBrand} ${haircareProductType} for ${haircareHairType} Hair (${haircareVolume}ml)`;
                        description = `Revitalize your hair with ${haircareBrand} ${haircareProductType}. Specifically designed for ${haircareHairType} to combat ${attributes.get('concern')}. ${attributes.get('ingredient_preference')} formula.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, haircareBrand, i);
                        break;
                    case 'sports-shoes':
                        const shoeBrand = attributes.get('brand');
                        const shoeSport = attributes.get('sport');
                        const shoeSize = attributes.get('size_uk');
                        const shoeColor = attributes.get('color');
                        title = `${shoeBrand} ${shoeSport} Shoes (Size UK ${shoeSize}) - ${shoeColor}`;
                        description = `High-performance ${shoeBrand} sports shoes for ${shoeSport}. Features ${attributes.get('closure_type')} closure and durable ${attributes.get('material')} upper. Ideal for ${attributes.get('terrain')} terrain.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, shoeBrand, i);
                        break;
                    case 'fitness-equipment':
                        const eqBrand = attributes.get('brand');
                        const eqProductType = attributes.get('product_type');
                        const eqMaterial = attributes.get('material');
                        title = `${eqBrand} ${eqProductType} (${eqMaterial})`;
                        description = `Durable ${eqBrand} ${eqProductType} for your home gym. Max weight capacity: ${attributes.get('max_weight_capacity_kg')}. ${attributes.get('foldable') ? 'Foldable design for easy storage.' : 'Sturdy construction.'}`;
                        imageUrl = getPlaceholderImageUrl(400, 300, eqBrand, i);
                        break;
                    case 'car-tyres':
                        const tyreBrand = attributes.get('brand');
                        const tyreSize = attributes.get('tyre_size');
                        const vehicleType = attributes.get('vehicle_type');
                        title = `${tyreBrand} ${vehicleType} Tyre (${tyreSize})`;
                        description = `Premium ${tyreBrand} tyre for ${vehicleType} in size ${tyreSize}. Suitable for ${attributes.get('season')} conditions. ${attributes.get('run_flat') ? 'Run flat technology included.' : ''} Comes with ${attributes.get('warranty_years')} years warranty.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, tyreBrand, i);
                        break;
                    case 'car-accessories':
                        const accProductType = attributes.get('product_type');
                        const accModelComp = attributes.get('car_model_compatibility');
                        const accColor = attributes.get('color');
                        title = `${accProductType} for ${accModelComp} (${accColor})`;
                        description = `High-quality ${accProductType} made from ${attributes.get('material')} in ${accColor}. ${accModelComp === 'Universal' ? 'Universal fit.' : `Custom fit for ${accModelComp}.`} Enhance your driving experience.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, 'Car_Accessory', i);
                        break;
                    case 'fiction-books':
                        const bookAuthor = attributes.get('author');
                        const bookGenre = attributes.get('genre');
                        const bookFormat = attributes.get('format');
                        title = `${getRandom(genericBookTitles)} by ${bookAuthor} (${bookGenre})`;
                        description = `Dive into this captivating ${bookGenre} novel by ${bookAuthor}. Available in ${bookFormat}. Approximately ${attributes.get('page_count')} pages. Language: ${attributes.get('language')}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, 'Book', i);
                        break;
                    case 'non-fiction-books':
                        const nfAuthor = attributes.get('author');
                        const nfGenre = attributes.get('genre');
                        const nfFormat = attributes.get('format');
                        title = `"${getRandom(genericBookTitles.filter(t => !t.includes('The')))}" by ${nfAuthor} (${nfGenre})`; // Filter out 'The' for non-fiction examples
                        description = `An insightful ${nfGenre} read by ${nfAuthor}. This ${nfFormat} book offers ${getRandom(['practical advice', 'historical insights', 'scientific knowledge'])}. Approx ${attributes.get('page_count')} pages. Language: ${attributes.get('language')}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, 'Non-Fiction_Book', i);
                        break;
                    case 'video-games':
                        const gamePlatform = attributes.get('platform');
                        const gameGenre = attributes.get('genre');
                        const gamePublisher = attributes.get('publisher');
                        title = `${getRandom(genericGameTitles)} (${gamePlatform})`;
                        description = `Immerse yourself in this ${gameGenre} game from ${gamePublisher} on ${gamePlatform}. ${attributes.get('multiplayer') ? 'Supports multiplayer.' : 'Single-player experience.'} Age rating: ${attributes.get('rating')}. Released in ${attributes.get('release_year')}. Condition: ${attributes.get('condition')}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, 'Video_Game', i);
                        break;
                    case 'sofas':
                        const sofaBrand = attributes.get('brand');
                        const sofaCapacity = attributes.get('seating_capacity');
                        const sofaMaterial = attributes.get('material');
                        const sofaColor = attributes.get('color');
                        title = `${sofaBrand} ${sofaCapacity} Sofa (${sofaMaterial}, ${sofaColor})`;
                        description = `Comfortable and stylish ${sofaBrand} sofa with ${sofaCapacity} seating. Made from high-quality ${sofaMaterial} in a beautiful ${sofaColor} shade. ${attributes.get('storage_available') ? 'Comes with convenient storage.' : ''} Style: ${attributes.get('style')}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, sofaBrand, i);
                        break;
                    case 'beds':
                        const bedBrand = attributes.get('brand');
                        const bedSize = attributes.get('bed_size');
                        const bedMaterial = attributes.get('material');
                        const bedStorageType = attributes.get('storage_type');
                        title = `${bedBrand} ${bedSize} Bed (${bedMaterial})`;
                        description = `Sturdy ${bedBrand} bed with a ${bedSize} size frame. Crafted from ${bedMaterial}. ${bedStorageType !== 'No Storage' ? `Features ${bedStorageType}.` : 'No storage.'} ${attributes.get('mattress_included') ? 'Mattress included.' : ''} With a ${attributes.get('headboard_type')} headboard.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, bedBrand, i);
                        break;
                    default:
                        title = `${category.name} Item ${i + 1}`;
                        description = `A generic ${category.name} item. Price: ${getRandomFloat(priceMin, priceMax)}.`;
                        imageUrl = getPlaceholderImageUrl(400, 300, category.name, i);
                        break;
                }

                listingsToCreate.push({
                    title,
                    description,
                    price: getRandomFloat(priceMin, priceMax),
                    location: getRandom(locations),
                    categoryId: category._id,
                    attributes: attributes,
                    images: [
                        imageUrl,
                        getPlaceholderImageUrl(400, 300, `${category.name}_Alt1`, i + 100),
                        getPlaceholderImageUrl(400, 300, `${category.name}_Alt2`, i + 200),
                    ],
                });
            }
        };

        generateListings('mobiles', 10, 8000, 120000);
        generateListings('laptops', 8, 25000, 150000);
        generateListings('headphones', 12, 1000, 20000);
        generateListings('refrigerators', 7, 15000, 60000);
        generateListings('washing-machines', 7, 10000, 45000);
        generateListings('blenders', 10, 1500, 8000);
        generateListings('mens-shirts', 15, 500, 3000);
        generateListings('mens-jeans', 15, 800, 4000);
        generateListings('womens-dresses', 15, 700, 5000);
        generateListings('womens-kurtas', 15, 400, 3000);
        generateListings('skincare', 20, 100, 2000);
        generateListings('haircare', 20, 150, 2500);
        generateListings('sports-shoes', 15, 1200, 10000);
        generateListings('fitness-equipment', 8, 500, 30000);
        generateListings('car-tyres', 5, 3000, 15000);
        generateListings('car-accessories', 10, 200, 5000);
        generateListings('fiction-books', 20, 150, 800);
        generateListings('non-fiction-books', 15, 200, 1200);
        generateListings('video-games', 10, 500, 6000);
        generateListings('sofas', 5, 10000, 80000);
        generateListings('beds', 5, 8000, 70000);


        await Listing.insertMany(listingsToCreate);
        console.log(`Successfully seeded ${listingsToCreate.length} listings.`);

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1); // Exit with a non-zero code to indicate failure
    } finally {
        await mongoose.disconnect();
        console.log('Database connection closed.');
    }
};

seedData();