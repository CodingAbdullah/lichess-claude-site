import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    if (!id) {
      return NextResponse.json({ error: 'Swiss tournament ID is required' }, { status: 400 });
    }

    // Build query parameters from request with defaults for maximum information
    const queryParams = new URLSearchParams();

    // Handle nb parameter (default to high number for comprehensive results)
    const nb = searchParams.get('nb') || '100';
    queryParams.append('nb', nb);

    const response = await axios.get(
      `https://lichess.org/api/swiss/${id}/results?${queryParams.toString()}`, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching Swiss tournament results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Swiss tournament results' }, 
      { status: 500 }
    );
  }
}