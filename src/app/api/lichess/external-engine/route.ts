import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    // Note: This endpoint requires authorization
    // In production, you would need to provide proper authorization headers
    const response = await axios.get('https://lichess.org/api/external-engine', {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.LICHESS_API_TOKEN}` // Would be needed in production
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching external engines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external engines' }, 
      { status: 500 }
    );
  }
}