import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const response = await axios.get(`https://lichess.org/api/user/${username}/note`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LICHESS_API_KEY}`
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user notes' }, 
      { status: 500 }
    );
  }
}