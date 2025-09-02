import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const text = searchParams.get('text');
    const page = searchParams.get('page') ?? '1';
    
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Search text is required' },
        { status: 400 }
      );
    }

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('text', text.trim());
    queryParams.append('page', page);

    const queryString = queryParams.toString();
    const url = `https://lichess.org/api/team/search?${queryString}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error searching teams:', error);
    return NextResponse.json(
      { error: 'Failed to search teams' },
      { status: 500 }
    );
  }
}