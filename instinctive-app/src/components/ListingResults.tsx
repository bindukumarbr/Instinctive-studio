import { IClientListing } from "@/app/types";
import ListingCard from "./ListingCard";

interface ListingResultsProps {
  listings: IClientListing[];
  totalResults: number;
  currentPage: number;
  limit: number;
}

export default function ListingResults({
  listings,
  totalResults,
  currentPage,
  limit,
}: ListingResultsProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8 p-4">
        <p>No listings found matching your criteria.</p>
        <p>Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(totalResults, currentPage * limit);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {" "}
      <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-6 text-left">
        Showing {startIndex} - {endIndex} of {totalResults} results
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
