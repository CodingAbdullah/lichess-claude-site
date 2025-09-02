import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const { searchParams } = new URL(request.url);

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Build query parameters from request with defaults for maximum information
    const queryParams = new URLSearchParams();
    
    // Handle nb parameter (default to 50 for comprehensive data)
    const nb = searchParams.get('nb') || '50';
    queryParams.append('nb', nb);

    // Handle performance parameter (default to true for maximum information)
    const performance = searchParams.get('performance') || 'true';
    queryParams.append('performance', performance);

    const response = await axios.get(
      `https://lichess.org/api/user/${username}/tournament/played?${queryParams.toString()}`, 
      {
        headers: {
          'Content-Type': 'application/json',
          // Note: This endpoint requires OAuth2 authorization
          // 'Authorization': `Bearer ${process.env.LICHESS_API_TOKEN}` // Would be needed in production
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user played tournaments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user played tournaments' }, 
      { status: 500 }
    );
  }
}