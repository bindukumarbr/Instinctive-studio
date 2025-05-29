// components/SkeletonCard.tsx
export default function SkeletonCard() {
  return (
    <div
      className="
                bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md
                flex flex-col h-full animate-pulse
                md:flex-row md:h-auto md:max-h-[180px] lg:flex-col lg:h-full lg:max-h-none
            "
    >
      <div
        className="
                    w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden p-2
                    md:w-32 md:h-32 md:flex-shrink-0 lg:w-full lg:h-48
                "
      >
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div
          className="
                        h-6 bg-gray-200 rounded w-3/4 mb-2
                        md:h-5 lg:h-6
                    "
        ></div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-12"></div>
        </div>

        <div className="h-7 bg-gray-200 rounded w-1/3 mb-2 mt-auto"></div>

        <div
          className="
                        h-4 bg-gray-200 rounded w-full mb-2
                        line-clamp-2 md:line-clamp-1 lg:line-clamp-2
                    "
        ></div>
        <div
          className="
                        h-4 bg-gray-200 rounded w-5/6 mb-3
                        hidden md:block
                        lg:block
                    "
        ></div>

        <div className="flex items-center text-gray-500 text-xs">
          <div className="w-4 h-4 mr-1 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
