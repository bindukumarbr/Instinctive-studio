// This code defines an API route in a Next.js application that connects to a MongoDB database,
// retrieves a list of categories with specific fields, and handles errors gracefully.
import { NextResponse } from 'next/server';
import Category from '../../../models/Category';
import dbConnect from '@/lib/mongodb';

export async function GET() {
    await dbConnect();
    try {
        const categories = await Category.find({}, 'name slug attributeSchema');
        return NextResponse.json(categories);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        // Extract a user-friendly error message
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error);
        return NextResponse.json({ message: 'Server error', error: errorMessage }, { status: 500 });
    }
}
