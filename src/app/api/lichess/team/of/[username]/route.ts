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

    const response = await axios.get(
      `https://lichess.org/api/team/of/${username}`, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user teams' }, 
      { status: 500 }
    );
  }
}