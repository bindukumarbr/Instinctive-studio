"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  useRouter,
  usePathname,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { ICategoryAttributeSchema, IFacet } from "@/app/types";

interface FilterPanelProps {
  facets: IFacet;
  categoryAttributeSchema: ICategoryAttributeSchema[];
  currentCategorySlug: string;
}

export default function FilterPanel({
  facets,
  categoryAttributeSchema,
  currentCategorySlug,
}: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const nextSearchParams = useNextSearchParams();

  const isCategorySelected = !!currentCategorySlug;

  const getInitialActiveFilters = useCallback(() => {
    const filtersJson = nextSearchParams.get("filters");
    try {
      return filtersJson ? JSON.parse(filtersJson) : {};
    } catch (e) {
      console.error("Error parsing filters JSON from URL:", e);
      return {};
    }
  }, [nextSearchParams]);

  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | string[]>
  >(getInitialActiveFilters);

  // Sync internal state with URL's 'filters' param
  useEffect(() => {
    if (isCategorySelected) {
      setActiveFilters(getInitialActiveFilters());
    } else {
      setActiveFilters({}); // Clear filters if no category is selected
    }
  }, [getInitialActiveFilters, isCategorySelected]);

  const currentCategorySchema = categoryAttributeSchema.find(
    (schema) => schema.categorySlug === currentCategorySlug
  );

  const handleFilterChange = (
    filterName: string,
    value: string,
    type: "checkbox" | "radio" | "text"
  ) => {
    setActiveFilters((prevFilters) => {
      let newFilterValue;
      if (type === "checkbox") {
        const currentValues = Array.isArray(prevFilters[filterName])
          ? (prevFilters[filterName] as string[])
          : [];
        newFilterValue = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
      } else {
        // 'radio' or 'text'
        newFilterValue = value;
      }

      const updatedFilters = { ...prevFilters, [filterName]: newFilterValue };

      // Clean up empty filters
      if (Array.isArray(newFilterValue) && newFilterValue.length === 0) {
        delete updatedFilters[filterName];
      } else if (typeof newFilterValue === "string" && newFilterValue === "") {
        delete updatedFilters[filterName];
      }
      return updatedFilters;
    });
  };

  // Update URL when activeFilters state changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(nextSearchParams.toString());
    let currentUrlFilters: Record<string, string | string[]> = {};
    try {
      const urlFiltersJson = nextSearchParams.get("filters");
      currentUrlFilters = urlFiltersJson ? JSON.parse(urlFiltersJson) : {};
    } catch (e) {
      console.error("Error parsing filters JSON from URL (in useEffect):", e);
    }

    const filtersHaveChanged =
      JSON.stringify(activeFilters) !== JSON.stringify(currentUrlFilters);

    if (Object.keys(activeFilters).length > 0) {
      newSearchParams.set("filters", JSON.stringify(activeFilters));
    } else {
      newSearchParams.delete("filters");
    }

    if (filtersHaveChanged) {
      newSearchParams.set("page", "1"); // Reset page when filters change
    }

    const currentUrl = `${pathname}?${nextSearchParams.toString()}`;
    const newUrl = `${pathname}?${newSearchParams.toString()}`;

    if (currentUrl !== newUrl) {
      router.push(newUrl);
    }
  }, [activeFilters, router, pathname, nextSearchParams]);

  const handleClearAllFilters = () => {
    const newSearchParams = new URLSearchParams(nextSearchParams.toString());
    newSearchParams.delete("filters");
    newSearchParams.set("page", "1"); // Reset page after clearing filters
    router.push(
      `<span class="math-inline">\{pathname\}?</span>{newSearchParams.toString()}`
    );
    setActiveFilters({}); // Clear local state
  };

  const isChecked = (filterName: string, value: string) => {
    const filterValue = activeFilters[filterName];
    return Array.isArray(filterValue)
      ? filterValue.includes(value)
      : filterValue === value;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Filters</h2>

      {/* Clear All Filters Button */}
      <button
        onClick={handleClearAllFilters}
        className={`
                    w-full py-2 px-4 rounded-md text-white font-medium mb-4
                    ${
                      Object.keys(activeFilters).length > 0 &&
                      isCategorySelected
                        ? "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        : "bg-red-400 cursor-not-allowed"
                    }
                `}
        disabled={
          Object.keys(activeFilters).length === 0 && !isCategorySelected
        }
      >
        Clear All Filters
      </button>

      {!isCategorySelected ? (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-sm text-center animate-fadeIn">
          <p className="font-medium mb-1">No Category Selected</p>
          <p>Please select a category to see and apply specific filters.</p>
        </div>
      ) : (
        <div>
          {/* General Facet Filters */}
          {Object.keys(facets).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                General Filters
              </h3>
              {Object.entries(facets).map(([facetName, values]) => (
                <div key={facetName} className="mb-4">
                  <h4 className="text-md font-medium capitalize mb-2">
                    {facetName.replace(/_/g, " ")}
                  </h4>
                  {values.map((facetItem, index) => (
                    <div
                      key={facetItem._id || index}
                      className="flex items-center mb-1"
                    >
                      <input
                        type="checkbox"
                        id={`facet-<span class="math-inline">\{facetName\}\-</span>{facetItem._id}`}
                        name={facetName}
                        value={facetItem._id}
                        checked={isChecked(facetName, facetItem._id)}
                        onChange={() =>
                          handleFilterChange(
                            facetName,
                            facetItem._id,
                            "checkbox"
                          )
                        }
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`facet-<span class="math-inline">\{facetName\}\-</span>{facetItem._id}`}
                        className="text-gray-700 cursor-pointer"
                      >
                        {facetItem._id} ({facetItem.count})
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Category-Specific Filters */}
          {currentCategorySchema &&
            currentCategorySchema.attributes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Category Attributes ({currentCategorySchema.categoryName})
                </h3>
                {currentCategorySchema.attributes.map((attr) => (
                  <div key={attr.key} className="mb-4">
                    <h4 className="text-md font-medium capitalize mb-2">
                      {attr.name}
                    </h4>
                    {attr.type === "enum" &&
                    attr.options &&
                    attr.options.length > 0 ? (
                      <div>
                        {attr.options.map((option, index) => (
                          <div key={index} className="flex items-center mb-1">
                            <input
                              type="checkbox"
                              id={`attr-<span class="math-inline">\{attr\.key\}\-</span>{option}`}
                              name={attr.key}
                              value={option}
                              checked={isChecked(attr.key, option)}
                              onChange={() =>
                                handleFilterChange(attr.key, option, "checkbox")
                              }
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`attr-<span class="math-inline">\{attr\.key\}\-</span>{option}`}
                              className="text-gray-700 cursor-pointer"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No filter options available for this attribute.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          {/* No Filters Available Message */}
          {Object.keys(facets).length === 0 &&
            (!currentCategorySchema ||
              currentCategorySchema.attributes.length === 0) && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm text-center animate-fadeIn">
                <p className="font-medium mb-1">No Filters Available</p>
                <p>
                  There are no specific filters for the current selection or
                  category.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
