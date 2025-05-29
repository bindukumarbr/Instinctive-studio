"use client";

import React from "react";
import { IClientListing } from "@/app/types";
import Link from "next/link";

interface ListingCardProps {
  listing: IClientListing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  // Formats price to Indian Rupees (INR)
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Truncates description for card view
  const truncatedDescription =
    listing.description.length > 100
      ? listing.description.substring(0, 97) + "..."
      : listing.description;

  // Type assertion for attributes for easier access
  const attributes = listing.attributes as Record<
    string,
    string | number | boolean | string[]
  >;

  return (
    <Link
      href={`/listing/${listing._id}`}
      className="block h-full no-underline text-inherit"
    >
      <div
        className="
                    bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md
                    flex flex-col h-full transition-all duration-200 ease-in-out
                    hover:translate-y-[-3px] hover:shadow-lg
                    md:flex-row md:h-auto md:max-h-[180px]
                    lg:flex-col lg:h-full lg:max-h-none
                "
      >
        <div
          className="
                        w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden p-2
                        md:w-32 md:h-32 md:flex-shrink-0
                        lg:w-full lg:h-48
                    "
        >
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png"; // Fallback image on error
              }}
            />
          ) : (
            <div className="text-gray-600 text-sm text-center">
              No Image Available
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3
            className="
                            text-lg font-semibold text-gray-900 mb-2 leading-tight
                            whitespace-nowrap overflow-hidden text-ellipsis
                            md:text-base lg:text-lg
                        "
          >
            {listing.title}
          </h3>

          {/* Displays key attributes like brand, RAM, storage */}
          {attributes && Object.keys(attributes).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {attributes.brand && (
                <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                  Brand: {attributes.brand}
                </span>
              )}
              {attributes.ram_gb && (
                <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                  RAM: {attributes.ram_gb}GB
                </span>
              )}
              {attributes.storage_gb && (
                <span className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                  Storage: {attributes.storage_gb}GB
                </span>
              )}
            </div>
          )}

          <p className="text-xl font-bold text-blue-700 mb-2 mt-auto">
            {formatPrice(listing.price)}
          </p>

          <p className="text-sm text-gray-600 mb-3 leading-snugline-clamp-2 md:line-clamp-1 lg:line-clamp-2">
            {truncatedDescription}
          </p>

          <div className="flex items-center text-gray-500 text-xs">
            <svg
              className="w-4 h-4 mr-1 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
            <span>{listing.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
