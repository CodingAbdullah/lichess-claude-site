import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Swiss tournament ID is required' }, { status: 400 });
    }

    const response = await axios.get(
      `https://lichess.org/api/swiss/${id}`, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching Swiss tournament:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Swiss tournament' }, 
      { status: 500 }
    );
  }
}