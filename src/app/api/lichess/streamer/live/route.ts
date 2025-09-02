import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://lichess.org/api/streamer/live', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching live streamers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live streamers' }, 
      { status: 500 }
    );
  }
}