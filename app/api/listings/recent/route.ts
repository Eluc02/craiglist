import { NextResponse } from 'next/server';
import { getRecentListings } from '@/lib/db';

export async function GET() {
    try {
        const listings = await getRecentListings();
        return NextResponse.json(listings);
    } catch (error) {
        console.error('Error fetching recent listings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
