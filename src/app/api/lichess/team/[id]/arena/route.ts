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
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    // Extract query parameters with defaults
    const max = searchParams.get('max') ?? '100';
    const status = searchParams.get('status');
    const createdBy = searchParams.get('createdBy');
    const name = searchParams.get('name');

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('max', max);
    if (status) queryParams.append('status', status);
    if (createdBy) queryParams.append('createdBy', createdBy);
    if (name) queryParams.append('name', name);

    const queryString = queryParams.toString();
    const url = `https://lichess.org/api/team/${id}/arena?${queryString}`;

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching team arena tournaments:', error);
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch team arena tournaments' },
      { status: 500 }
    );
  }
}