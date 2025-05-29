import { ISearchResults, ICategory } from "@/app/types";

export async function fetchSearchResults(
  q: string,
  category: string,
  page: number,
  limit: number,
  filters: string
): Promise<ISearchResults> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return {
      listings: [],
      facets: {},
      categoryAttributeSchema: [],
      totalPages: 0,
      currentPage: page,
      totalResults: 0,
      limit: limit,
      detectedCategorySlug: undefined,
    };
  }

  const url = new URL(`${baseUrl}/api/search`);

  if (q) url.searchParams.set("q", q);
  if (category) url.searchParams.set("category", category);
  if (filters) url.searchParams.set("filters", filters);

  url.searchParams.set("page", page.toString());
  url.searchParams.set("limit", limit.toString());

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        listings: [],
        facets: {},
        categoryAttributeSchema: [],
        totalPages: 0,
        currentPage: page,
        totalResults: 0,
        limit: limit,
        detectedCategorySlug: undefined,
      };
    }

    const data: ISearchResults = await res.json();
    return data;
  } catch (error) {
    return {
      listings: [],
      facets: {},
      categoryAttributeSchema: [],
      totalPages: 0,
      currentPage: page,
      totalResults: 0,
      limit: limit,
      detectedCategorySlug: undefined,
    };
  }
}

export async function fetchCategories(): Promise<ICategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return [];
  }

  const url = `${baseUrl}/api/categories`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data: ICategory[] = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}
