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

    const response = await axios.get(`https://lichess.org/api/user/${username}/rating-history`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user rating history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user rating history' }, 
      { status: 500 }
    );
  }
}