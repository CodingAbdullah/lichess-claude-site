import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://lichess.org/api/puzzle/daily', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching daily puzzle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily puzzle' }, 
      { status: 500 }
    );
  }
}