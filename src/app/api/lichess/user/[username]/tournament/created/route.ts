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

    // Build query parameters from request
    const queryParams = new URLSearchParams();
    
    // Handle nb parameter (default to 50 for comprehensive data)
    const nb = searchParams.get('nb') || '50';
    queryParams.append('nb', nb);

    // Handle status parameters (can be multiple) - default to all if none specified
    const statusParams = searchParams.getAll('status');
    if (statusParams.length === 0) {
      // Default to all tournament statuses for maximum information
      queryParams.append('status', '10'); // Created
      queryParams.append('status', '20'); // Started  
      queryParams.append('status', '30'); // Finished
    } else {
      statusParams.forEach(status => {
        if (['10', '20', '30'].includes(status)) {
          queryParams.append('status', status);
        }
      });
    }

    const response = await axios.get(
      `https://lichess.org/api/user/${username}/tournament/created?${queryParams.toString()}`, 
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
    console.error('Error fetching user created tournaments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user created tournaments' }, 
      { status: 500 }
    );
  }
}