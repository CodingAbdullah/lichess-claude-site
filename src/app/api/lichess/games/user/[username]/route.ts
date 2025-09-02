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
    
    // Add all supported query parameters
    const supportedParams = [
      'since', 'until', 'max', 'vs', 'rated', 'perfType', 'color',
      'analysed', 'moves', 'pgnInJson', 'tags', 'clocks', 'evals',
      'accuracy', 'opening', 'division', 'ongoing', 'finished',
      'literate', 'lastFen', 'withBookmarked', 'sort'
    ];

    // Set default values for maximum information when not provided
    const defaultParams = {
      moves: 'true',
      tags: 'true', 
      clocks: 'true',
      evals: 'true',
      accuracy: 'true',
      opening: 'true',
      division: 'true',
      finished: 'true',
      literate: 'true',
      lastFen: 'true',
      withBookmarked: 'true',
      sort: 'dateDesc'
    };

    supportedParams.forEach(param => {
      const value = searchParams.get(param);
      if (value !== null) {
        queryParams.append(param, value);
      } else if (defaultParams[param as keyof typeof defaultParams]) {
        queryParams.append(param, defaultParams[param as keyof typeof defaultParams]);
      }
    });

    const response = await axios.get(
      `https://lichess.org/api/games/user/${username}?${queryParams.toString()}`, 
      {
        headers: {
          'Content-Type': 'application/json',
          // Note: This endpoint supports OAuth2 authorization
          // 'Authorization': `Bearer ${process.env.LICHESS_API_TOKEN}` // Would be needed for private games
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching user games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user games' }, 
      { status: 500 }
    );
  }
}