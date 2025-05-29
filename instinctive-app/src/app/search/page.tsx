import ListingResults from "@/components/ListingResults";
import FilterPanel from "@/components/FilterPanel";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/PaginationControls";
import { ISearchResults, ICategory } from "@/app/types";
import { fetchCategories, fetchSearchResults } from "@/lib/data";

interface SearchPageProps {
  searchParams:
    | { [key: string]: string | string[] | undefined }
    | Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  console.log(`\n--- SearchPage Server Component Render ---`);

  const resolvedSearchParams = await searchParams;

  const currentCleanSearchParams: {
    [key: string]: string | string[] | undefined;
  } = {};
  for (const key in resolvedSearchParams) {
    if (
      Object.prototype.hasOwnProperty.call(resolvedSearchParams, key) &&
      key !== "_debugInfo"
    ) {
      currentCleanSearchParams[key] = resolvedSearchParams[key];
    }
  }

  const q = (currentCleanSearchParams.q as string) || "";
  const categorySlug = (currentCleanSearchParams.category as string) || "";
  const page = parseInt((currentCleanSearchParams.page as string) || "1", 10);
  const limit = parseInt(
    (currentCleanSearchParams.limit as string) || "10",
    10
  );
  const filtersParam = (currentCleanSearchParams.filters as string) || "";

  console.log("Extracted search parameters:", {
    q,
    categorySlug,
    page,
    limit,
    filtersParam,
  });

  let searchResults: ISearchResults;
  let categories: ICategory[];

  try {
    const [fetchedSearchResults, fetchedCategories] = await Promise.all([
      fetchSearchResults(q, categorySlug, page, limit, filtersParam),
      fetchCategories(),
    ]);
    searchResults = fetchedSearchResults;
    categories = fetchedCategories;

    console.log(`[SearchPage] fetched searchResults and categories.`);
  } catch (error) {
    console.error(`[SearchPage] Error during data fetching:`, error);
    searchResults = {
      listings: [],
      totalResults: 0,
      currentPage: page,
      totalPages: 1,
      facets: {},
      categoryAttributeSchema: [],
      limit: limit,
    };
    categories = [];
  }

  if (!searchResults) {
    console.error(
      "[SearchPage] searchResults is undefined. Assigning fallback."
    );
    searchResults = {
      listings: [],
      totalResults: 0,
      currentPage: page,
      totalPages: 1,
      facets: {},
      categoryAttributeSchema: [],
      limit: limit,
    };
  }
  if (!categories) {
    console.error("[SearchPage] categories is undefined. Assigning fallback.");
    categories = [];
  }

  console.log(`--- SearchPage Server Component Render End ---\n`);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Listings</h1>
      <div className="mb-8">
        <SearchBar
          initialQuery={q}
          initialCategory={categorySlug}
          categories={categories}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside
          className="
                        md:col-span-1 bg-white p-4 rounded-lg shadow-md
                        md:sticky md:top-4 md:self-start md:max-h-[calc(100vh-2rem)] md:overflow-y-auto
                    "
        >
          <FilterPanel
            facets={searchResults.facets}
            categoryAttributeSchema={searchResults.categoryAttributeSchema}
            currentCategorySlug={categorySlug}
          />
        </aside>

        <main className="md:col-span-3">
          <ListingResults
            listings={searchResults.listings}
            totalResults={searchResults.totalResults}
            currentPage={searchResults.currentPage}
            limit={limit}
          />
          <Pagination
            currentPage={searchResults.currentPage}
            totalPages={searchResults.totalPages}
            limit={limit}
            searchParams={currentCleanSearchParams}
          />
        </main>
      </div>
    </div>
  );
}
