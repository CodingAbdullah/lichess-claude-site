import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://lichess.org/api/tv/channels', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching TV channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TV channels' }, 
      { status: 500 }
    );
  }
}