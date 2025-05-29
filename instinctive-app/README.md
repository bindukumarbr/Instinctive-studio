# Instinctive B2B Marketplace Search

This project implements a robust search and filtering solution for a B2B marketplace catalogue, as part of a coding challenge. It features a dynamic data layer, a powerful search API using MongoDB Aggregation Framework, and a responsive Next.js UI.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Features](#features)
3.  [Technologies Used](#technologies-used)
4.  [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Installation](#installation)
    - [Database Setup & Seeding](#database-setup--seeding)
    - [Running the Application](#running-the-application)
5.  [Project Structure](#project-structure)
6.  [API Endpoints](#api-endpoints)
    - [`GET /api/search`](#get-apisearch)
    - [`GET /api/categories`](#get-apicategories)
7.  [Data Model](#data-model)
8.  [Key Implementations](#key-implementations)
9.  [Screenshots](#screenshots)
10. [Future Enhancements](#future-enhancements)
11. [Author](#author)

## Project Overview

This application prototypes a B2B marketplace where users can search a large catalogue of business listings. It allows for free-text keyword search, filtering by specific categories, and applying dynamic attribute filters based on the selected category. The backend is built with Node.js and Next.js API Routes, leveraging MongoDB for data storage and complex aggregation queries. The frontend is a Next.js application providing an intuitive search interface.

## Features

- **Full-Text Search:** Search listings by keywords in their `title` and `description`.
- **Category Filtering:** Filter listings by specific business categories (e.g., "Mobiles", "Laptops").
- **Dynamic Attribute Filtering:** Filter listings based on category-specific attributes (e.g., "RAM", "Storage" for "Mobiles"). Filter options and counts are dynamically generated based on search results.
- **General Attribute Filtering:** Filter by common listing attributes like `brand` and `condition`.
- **Pagination:** Navigate through search results across multiple pages.
- **Persistent URL State:** Search queries, category selections, and applied filters are reflected in the URL, allowing for shareable search links and browser history navigation.
- **Responsive UI:** A clean and responsive user interface built with Tailwind CSS.
- **Skeleton Loaders:** Provides a smooth loading experience while data is being fetched.
- **Error Boundaries:** Graceful handling and display of errors on the search page.
- **Database Seeding:** Includes a script to populate the database with sample categories and listings for quick setup.

## Technologies Used

- **Next.js**: 15 (React Framework for production)
- **Node.js**: v18.x (JavaScript runtime environment)
- **MongoDB**: (NoSQL Database - Compatible with local, Docker, or Atlas)
- **Mongoose**: (MongoDB object modeling for Node.js)
- **React**: (JavaScript library for building user interfaces)
- **Tailwind CSS**: (A utility-first CSS framework)

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- **Node.js**: Ensure you have Node.js (v18.x or newer recommended) and npm/yarn/pnpm/bun installed.
  - [Node.js Download](https://nodejs.org/en/download/)
- **MongoDB Atlas (Cloud-hosted)**:
  - You'll need a MongoDB Atlas cluster. If you don't have one, create a free tier cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  - Ensure you have a **database user with read and write permissions** for your application.
  - Obtain your connection string. Go to your Atlas cluster, click "Connect", choose "Connect your application", and copy the provided URI.

### Environment Variables

Create a `.env` file in the root of your project. This file will store your MongoDB Atlas connection string.

```env
# Your MongoDB Atlas connection URI.
# Replace <username> and <password> with your actual MongoDB Atlas database user credentials.
# Example: MONGODB_URI=mongodb+srv://youruser:yourpassword@yourcluster.mongodb.net/instinctivedb?retryWrites=true&w=majority&appName=your-app-name

# Base URL for API calls from the client-side.
# For local development, this should point to your local Next.js server.
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

**Important for MongoDB Atlas:**

- Replace `<username>` and `<password>` in the example with your actual MongoDB Atlas database user credentials.
- Ensure your MongoDB Atlas cluster's **Network Access** settings allow connections from your development machine's IP address (add `0.0.0.0/0` for development, or your specific IP, for optimal connectivity).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Database Setup & Seeding

1.  **Ensure MongoDB is Running:** Make sure your chosen MongoDB instance (local, Docker, or Atlas) is active and accessible via the `MONGODB_URI` in your `.env` file.
2.  **Seed the Database:** Run the seeding script to populate your database with sample data (e.g., "Mobiles" and "Laptops" categories with associated listings).
    ```bash
    npm run seed
    ```
    This script will connect to your MongoDB, clear any existing categories and listings, and then insert new sample data. You should see success messages in your console upon completion.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
2.  **Open in browser:**
    Open [http://localhost:3000](http://localhost:3000) in your web browser. You will land on a welcome page, from which you can navigate to the search page.

## Project Structure

The project follows a standard Next.js 14 App Router structure with clear separation of concerns:

```
.
├── public/                 # Static assets (e.g., images, favicon)
├── scripts/                # Database seeding scripts (e.g., seed.ts)
├── src/
│   ├── app/                # Next.js App Router root
│   │   ├── api/            # Next.js API Routes
│   │   │   ├── categories/ # Endpoint for fetching categories
│   │   │   └── search/     # Endpoint for search and filtering listings
│   │   ├── search/         # Search page route
│   │   │   ├── error.tsx   # Error Boundary for the search page
│   │   │   ├── loading.tsx # Loading UI for the search page
│   │   │   └── page.tsx    # Main search page component (Server Component)
│   │   ├── types/          # TypeScript type definitions (e.g., index.ts)
│   │   ├── favicon.ico
│   │   ├── globals.css     # Global CSS styles (imports Tailwind CSS)
│   │   ├── layout.tsx      # Root layout for the entire application
│   │   └── page.tsx        # Home page (e.g., Welcome screen)
│   ├── components/         # Reusable React components
│   │   ├── FilterPanel.tsx       # Sidebar for dynamic filters
│   │   ├── ListingCard.tsx       # Individual listing display card
│   │   ├── ListingResults.tsx    # Grid container for listing cards
│   │   ├── PaginationControls.tsx # Controls for navigating pages
│   │   ├── SearchBar.tsx         # Search input and category dropdown
│   │   └── SkeletonCard.tsx      # Placeholder for loading listing cards
│   ├── lib/                # Utility functions and configurations
│   │   ├── data.ts         # Functions for fetching data from API routes
│   │   └── mongodb.ts      # MongoDB connection utility
│   └── models/             # Mongoose schemas for MongoDB collections
│       ├── Category.ts     # Defines the Category document structure
│       └── Listing.ts      # Defines the Listing document structure
├── .env                    # Environment variables (not committed to Git)
├── .gitignore
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## API Endpoints

### `GET /api/search`

This endpoint facilitates searching and filtering listings based on various criteria.

- **URL:** `/api/search`
- **Method:** `GET`
- **Parameters:**

  - `q` (string, optional): Full-text keyword to match against `title` and `description`.
  - `category` (string, optional): Category slug (e.g., `mobiles`, `laptops`). If provided, results are filtered by this category, and dynamic facets are returned based on its `attributeSchema`.
  - `filters` (JSON string, optional): URL-encoded JSON object of attribute key-value pairs to refine results.
    - **Example:** `{"ram_gb": "8GB", "condition": "New", "brand": ["Samsung", "Xiaomi"]}`.
    - Values can be single strings or arrays of strings for multi-select filters.
  - `page` (number, optional, default: `1`): The current page number for pagination.
  - `limit` (number, optional, default: `10`): The number of results to return per page.

- **Example Request (from browser URL):**

  ```
  http://localhost:3000/api/search?q=phone&category=mobiles&filters=%7B%22brand%22%3A%5B%22Samsung%22%2C%22Xiaomi%22%5D%2C%22ram_gb%22%3A%228GB%22%7D&page=1&limit=5
  ```

  _(Decoded `filters` parameter: `{"brand":["Samsung","Xiaomi"],"ram_gb":"8GB"}`)_

- **Example JSON Response:**
  ```json
  {
    "listings": [
      {
        "_id": "65b9c0e4a7a8d9e0f1c2b3a4",
        "title": "Samsung Galaxy S23",
        "description": "Powerful smartphone with advanced camera.",
        "price": 79999.0,
        "location": "Bengaluru",
        "categoryId": "65b9c0e4a7a8d9e0f1c2b3a0",
        "images": [
          "[https://placehold.co/400x300/E0E0E0/6C6C6C?text=Samsung+S23](https://placehold.co/400x300/E0E0E0/6C6C6C?text=Samsung+S23)"
        ],
        "attributes": {
          "ram_gb": "8GB",
          "storage_gb": "128GB",
          "screen_size_in": "6.1",
          "color": "Black"
        },
        "condition": "New",
        "brand": "Samsung",
        "createdAt": "2024-05-29T10:00:00.000Z",
        "updatedAt": "2024-05-29T10:00:00.000Z"
      },
      {
        "_id": "65b9c0e4a7a8d9e0f1c2b3a5",
        "title": "Xiaomi Redmi Note 12",
        "description": "Affordable phone with great battery life.",
        "price": 19999.0,
        "location": "Mumbai",
        "categoryId": "65b9c0e4a7a8d9e0f1c2b3a0",
        "images": [
          "[https://placehold.co/400x300/E0E0E0/6C6C6C?text=Xiaomi+Note12](https://placehold.co/400x300/E0E0E0/6C6C6C?text=Xiaomi+Note12)"
        ],
        "attributes": {
          "ram_gb": "8GB",
          "storage_gb": "256GB",
          "screen_size_in": "6.67",
          "color": "Blue"
        },
        "condition": "New",
        "brand": "Xiaomi",
        "createdAt": "2024-05-28T15:30:00.000Z",
        "updatedAt": "2024-05-28T15:30:00.000Z"
      }
    ],
    "facets": {
      "condition": [
        { "_id": "New", "count": 20 },
        { "_id": "Used", "count": 5 }
      ],
      "brand": [
        { "_id": "Samsung", "count": 15 },
        { "_id": "Xiaomi", "count": 10 },
        { "_id": "Apple", "count": 8 }
      ],
      "ram_gb": [
        { "_id": "8GB", "count": 12 },
        { "_id": "16GB", "count": 8 }
      ],
      "storage_gb": [
        { "_id": "128GB", "count": 10 },
        { "_id": "256GB", "count": 10 },
        { "_id": "512GB", "count": 5 }
      ]
    },
    "categoryAttributeSchema": [
      {
        "_id": "65b9c0e4a7a8d9e0f1c2b3a0",
        "categorySlug": "mobiles",
        "categoryName": "Mobiles",
        "attributes": [
          {
            "key": "ram_gb",
            "name": "RAM (GB)",
            "type": "enum",
            "options": ["8GB", "12GB", "16GB"]
          },
          {
            "key": "storage_gb",
            "name": "Storage (GB)",
            "type": "enum",
            "options": ["128GB", "256GB", "512GB", "1TB"]
          },
          {
            "key": "screen_size_in",
            "name": "Screen Size (inches)",
            "type": "enum",
            "options": ["6.1", "6.7", "7.2"]
          },
          { "key": "has_5g", "name": "Has 5G", "type": "boolean" }
        ]
      }
    ],
    "totalPages": 3,
    "currentPage": 1,
    "totalResults": 25
  }
  ```

## Data Model

The application uses two primary MongoDB collections: `Category` and `Listing`.

- **`Category` Schema:**

  - `name` (String): Display name of the category (e.g., "Mobiles").
  - `slug` (String): URL-friendly identifier for the category (e.g., "mobiles").
  - `attributeSchema` (Array of Objects): Defines the unique attributes relevant to this category. Each object has:
    - `key` (String): The programmatic key for the attribute (e.g., "ram_gb").
    - `name` (String): The human-readable name (e.g., "RAM (GB)").
    - `type` (String): Data type for the attribute (e.g., "enum", "multi_enum", "boolean", "number", "range").
    - `options` (Array of Strings, optional): For `enum` and `multi_enum` types, lists predefined values.

- **`Listing` Schema:**
  - `title` (String): Title of the listing.
  - `description` (String): Detailed description.
  - `price` (Number): Price of the listing.
  - `location` (String): Location of the listing.
  - `categoryId` (ObjectId): Reference to the associated `Category` document.
  - `images` (Array of Strings): URLs or paths to listing images.
  - `attributes` (Map<String, any>): A flexible key-value object to store category-specific attributes and their values (e.g., `{"ram_gb": "8GB", "has_5g": true}`).
  - `condition` (String): General condition of the item (e.g., "New", "Used").
  - `brand` (String): General brand of the item.
  - `createdAt`, `updatedAt` (Date): Timestamps for document creation and last update.

## Key Implementations

- **MongoDB Aggregation Framework:** The core of the `/api/search` endpoint utilizes MongoDB's `$facet` aggregation stage to simultaneously retrieve paginated listings, a total count of matching documents, and dynamic facet counts for all relevant filters. This ensures high accuracy and efficiency.
- **Dynamic Facet Generation:** The filter panel dynamically generates filter options (checkboxes, dropdowns) and their counts based on the `facets` response from the `/api/search` endpoint, ensuring that only relevant and available filters are shown to the user.
- **Server Components & Client Components:** The Next.js application effectively uses a mix of Server Components for initial data fetching and rendering, and Client Components for interactive UI elements like the filter panel, search bar, and pagination controls. This optimizes performance and user experience.
- **Type-Safe Development:** Leveraging TypeScript across the frontend and backend for robust, scalable, and maintainable code, reducing common runtime errors.
- **Responsive Design:** Utilizes Tailwind CSS to ensure the application's layout adapts seamlessly across various device sizes (mobile, tablet, desktop).

## Author

**[Your Name Here]**

- Bindukumar BR
- mailto : bkbhrs99@gmail.com

---
