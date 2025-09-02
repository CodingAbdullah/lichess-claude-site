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
      return NextResponse.json({ error: 'Swiss tournament ID is required' }, { status: 400 });
    }

    // Build query parameters from request with defaults for maximum information
    const queryParams = new URLSearchParams();

    // Optional player filter
    const player = searchParams.get('player');
    if (player) {
      queryParams.append('player', player);
    }

    // Include moves (default: true)
    const moves = searchParams.get('moves') || 'true';
    queryParams.append('moves', moves);

    // Include PGN in JSON (default: true for maximum information)
    const pgnInJson = searchParams.get('pgnInJson') || 'true';
    queryParams.append('pgnInJson', pgnInJson);

    // Include PGN tags (default: true)
    const tags = searchParams.get('tags') || 'true';
    queryParams.append('tags', tags);

    // Include clock information (default: true for maximum information)
    const clocks = searchParams.get('clocks') || 'true';
    queryParams.append('clocks', clocks);

    // Include evaluations (default: true for maximum information)
    const evals = searchParams.get('evals') || 'true';
    queryParams.append('evals', evals);

    // Include accuracy (default: true for maximum information)
    const accuracy = searchParams.get('accuracy') || 'true';
    queryParams.append('accuracy', accuracy);

    // Include opening information (default: true for maximum information)
    const opening = searchParams.get('opening') || 'true';
    queryParams.append('opening', opening);

    // Include division markers (default: true for maximum information)
    const division = searchParams.get('division') || 'true';
    queryParams.append('division', division);

    const response = await axios.get(
      `https://lichess.org/api/swiss/${id}/games?${queryParams.toString()}`, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching Swiss tournament games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Swiss tournament games' }, 
      { status: 500 }
    );
  }
}