"use client";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">
        Welcome to Instinctive App!
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Your one-stop destination for discovering amazing listings.
      </p>
      <Link href="/search" passHref>
        <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
          Start Exploring
        </button>
      </Link>
    </div>
  );
}