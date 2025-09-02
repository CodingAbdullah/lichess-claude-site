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
      return NextResponse.json(
        { error: 'Tournament ID is required' },
        { status: 400 }
      );
    }

    // Extract query parameters
    const nb = searchParams.get('nb');
    const sheet = searchParams.get('sheet');

    // Build query string
    const queryParams = new URLSearchParams();
    if (nb) queryParams.append('nb', nb);
    if (sheet) queryParams.append('sheet', sheet);

    const queryString = queryParams.toString();
    const url = `https://lichess.org/api/tournament/${id}/results${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching arena tournament results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch arena tournament results' },
      { status: 500 }
    );
  }
}