"use client";

import { useEffect } from 'react';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

/**
 * Error boundary component for the /search route.
 * This component catches errors in its child components and displays a fallback UI,
 * allowing the user to attempt a retry.
 */
export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service (e.g., Sentry, Datadog)
        console.error("Caught an error in /search route:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-red-900">
                    Something went wrong!
                </h2>
                <p className="mt-2 text-sm text-red-600">
                    We are sorry, but there was an issue loading the search results.
                </p>
                {/* Display error message for debugging purposes. Consider hiding in production. */}
                <p className="mt-2 text-xs text-red-500">
                    Error details: {error.message}
                </p>
                <div className="mt-6">
                    <button
                        className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => reset()} // Attempts to re-render the segment that threw the error
                    >
                        Try again
                    </button>
                </div>
            </div>
        </div>
    );
}