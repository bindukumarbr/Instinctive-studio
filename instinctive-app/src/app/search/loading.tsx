import SkeletonCard from '@/components/SkeletonCard';

/**
 * Loading UI for the /search route.
 * Displays a skeleton of the search page while data loads.
 */
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="container mx-auto flex space-x-2">
                    <div className="flex-grow p-2 bg-gray-200 rounded-md animate-pulse h-10"></div>
                    <div className="p-2 bg-gray-200 rounded-md w-32 animate-pulse h-10"></div>
                    <div className="px-4 py-2 bg-gray-200 rounded-md w-24 animate-pulse h-10"></div>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 flex">
                <aside className="w-1/4 pr-4">
                    <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="mb-4">
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="flex flex-col space-y-1">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            <div className="h-10 w-24 bg-gray-200 rounded"></div>
                            <div className="h-10 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </aside>

                <section className="w-3/4 pl-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}