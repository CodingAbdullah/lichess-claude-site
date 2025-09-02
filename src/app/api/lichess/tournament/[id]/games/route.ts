import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);

    if (!id) {
      return NextResponse.json(
        { error: 'Tournament ID is required' },
        { status: 400 }
      );
    }

    // Extract query parameters with defaults
    const player = searchParams.get('player');
    const moves = searchParams.get('moves') ?? 'true';
    const pgnInJson = searchParams.get('pgnInJson') ?? 'true';
    const tags = searchParams.get('tags') ?? 'true';
    const clocks = searchParams.get('clocks') ?? 'true';
    const evals = searchParams.get('evals') ?? 'true';
    const accuracy = searchParams.get('accuracy') ?? 'true';
    const opening = searchParams.get('opening') ?? 'true';
    const division = searchParams.get('division') ?? 'true';

    // Build query string
    const queryParams = new URLSearchParams();
    if (player) queryParams.append('player', player);
    queryParams.append('moves', moves);
    queryParams.append('pgnInJson', pgnInJson);
    queryParams.append('tags', tags);
    queryParams.append('clocks', clocks);
    queryParams.append('evals', evals);
    queryParams.append('accuracy', accuracy);
    queryParams.append('opening', opening);
    queryParams.append('division', division);

    const queryString = queryParams.toString();
    const url = `https://lichess.org/api/tournament/${id}/games?${queryString}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching arena tournament games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch arena tournament games' },
      { status: 500 }
    );
  }
}