import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Tournament ID is required' },
        { status: 400 }
      );
    }

    const url = `https://lichess.org/api/tournament/${id}/teams`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching tournament team standings:', error);
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch tournament team standings' },
      { status: 500 }
    );
  }
}