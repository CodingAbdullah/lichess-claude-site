import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nb = searchParams.get('nb') || '20';
    const html = searchParams.get('html') || 'false';

    const queryParams = new URLSearchParams();
    queryParams.append('nb', nb);
    queryParams.append('html', html);

    const response = await axios.get(`https://lichess.org/api/broadcast?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch broadcasts' }, 
      { status: 500 }
    );
  }
}