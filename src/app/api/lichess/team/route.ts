import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = searchParams.get('page') ?? '1';
    
    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);

    const queryString = queryParams.toString();
    const url = `https://lichess.org/api/team/all?${queryString}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching all teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all teams' },
      { status: 500 }
    );
  }
}