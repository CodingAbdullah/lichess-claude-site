import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Search query (q) is required' }, { status: 400 });
    }

    const response = await axios.get(`https://lichess.org/api/fide/player?q=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching FIDE players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FIDE players' }, 
      { status: 500 }
    );
  }
}