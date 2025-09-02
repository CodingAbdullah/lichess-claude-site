import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const withSignal = searchParams.get('withSignal') === 'true';
    const withGameIds = searchParams.get('withGameIds') === 'true';
    const withGameMetas = searchParams.get('withGameMetas') === 'true';

    if (!ids) {
      return NextResponse.json({ error: 'ids parameter is required' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('ids', ids);
    if (withSignal) params.append('withSignal', 'true');
    if (withGameIds) params.append('withGameIds', 'true');
    if (withGameMetas) params.append('withGameMetas', 'true');

    const response = await axios.get(`https://lichess.org/api/users/status?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching users status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users status' }, 
      { status: 500 }
    );
  }
}