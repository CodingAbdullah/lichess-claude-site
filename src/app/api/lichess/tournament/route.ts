import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get(
      'https://lichess.org/api/tournament', 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching arena tournaments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch arena tournaments' }, 
      { status: 500 }
    );
  }
}