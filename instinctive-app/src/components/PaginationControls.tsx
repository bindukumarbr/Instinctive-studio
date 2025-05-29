"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PaginationControls({
  currentPage,
  totalPages,
  limit,
  searchParams,
}: PaginationControlsProps) {
  const router = useRouter();

  const createPageUrl = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams();

      // Preserve existing search parameters
      for (const key in searchParams) {
        if (
          Object.prototype.hasOwnProperty.call(searchParams, key) &&
          searchParams[key] !== undefined &&
          key !== "_debugInfo"
        ) {
          const value = searchParams[key];
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (typeof item === "string") {
                newSearchParams.append(key, item);
              }
            });
          } else if (typeof value === "string") {
            newSearchParams.set(key, value);
          }
        }
      }

      newSearchParams.set("page", String(page));
      newSearchParams.set("limit", String(limit));

      return `/search?${newSearchParams.toString()}`;
    },
    [searchParams, limit]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(createPageUrl(page));
    },
    [router, createPageUrl]
  );

  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // Adjust startPage to ensure `maxPageButtons` are displayed if possible
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null; // No pagination needed
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap">
      {/* First Page Button */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage <= 1}
        className="
                    px-4 py-2 border border-blue-500 text-blue-500 rounded-md
                    hover:bg-blue-50 hover:text-blue-600
                    disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
                    text-sm transition-colors duration-200
                "
      >
        First
      </button>

      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="
                    px-4 py-2 border border-blue-500 text-blue-500 rounded-md
                    hover:bg-blue-50 hover:text-blue-600
                    disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
                    text-sm transition-colors duration-200
                "
      >
        Previous
      </button>

      {/* Ellipsis before page numbers if not starting from 1 */}
      {startPage > 1 && <span className="text-gray-600 px-2 py-1">...</span>}

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`
                        px-4 py-2 rounded-md text-sm font-medium
                        transition-colors duration-200
                        ${
                          page === currentPage
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                        }
                    `}
        >
          {page}
        </button>
      ))}

      {/* Ellipsis after page numbers if not ending at totalPages */}
      {endPage < totalPages && (
        <span className="text-gray-600 px-2 py-1">...</span>
      )}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="
                    px-4 py-2 border border-blue-500 text-blue-500 rounded-md
                    hover:bg-blue-50 hover:text-blue-600
                    disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
                    text-sm transition-colors duration-200
                "
      >
        Next
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="
                    px-4 py-2 border border-blue-500 text-blue-500 rounded-md
                    hover:bg-blue-50 hover:text-blue-600
                    disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
                    text-sm transition-colors duration-200
                "
      >
        Last
      </button>
    </div>
  );
}
