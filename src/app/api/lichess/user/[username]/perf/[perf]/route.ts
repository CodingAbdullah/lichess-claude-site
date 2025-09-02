import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string; perf: string } }
) {
  try {
    const { username, perf } = params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (!perf) {
      return NextResponse.json({ error: 'Performance type is required' }, { status: 400 });
    }

    const response = await axios.get(`https://lichess.org/api/user/${username}/perf/${perf}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user performance stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user performance stats' }, 
      { status: 500 }
    );
  }
}