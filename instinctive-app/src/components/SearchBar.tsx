"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ICategory } from "@/app/types";

interface SearchBarProps {
  initialQuery: string;
  initialCategory: string;
  categories: ICategory[];
}

export default function SearchBar({
  initialQuery,
  initialCategory,
  categories,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  useEffect(() => {
    setQuery(initialQuery);
    setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    const newSearchParams = new URLSearchParams(currentSearchParams.toString());

    if (query) {
      newSearchParams.set("q", query);
    } else {
      newSearchParams.delete("q");
    }

    if (selectedCategory) {
      newSearchParams.set("category", selectedCategory);
    } else {
      newSearchParams.delete("category");
    }

    newSearchParams.delete("page"); // Reset page on new search

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);

    const newSearchParams = new URLSearchParams(currentSearchParams.toString());

    if (newCategory) {
      newSearchParams.set("category", newCategory);
    } else {
      newSearchParams.delete("category");
    }

    newSearchParams.delete("page"); // Reset page on category change

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-4 mb-6 items-center"
    >
      <input
        type="text"
        placeholder="Search listings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
      >
        Search
      </button>
    </form>
  );
}
