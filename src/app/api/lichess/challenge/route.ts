import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const challengeData = await request.json();
    const { username, ...challengeParams } = challengeData;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Step 1: Validate username first
    try {
      const userResponse = await axios.get(
        `https://lichess.org/api/user/${username}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (userResponse.status !== 200) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    } catch (userError: any) {
      if (userError.response?.status === 404) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      throw userError;
    }

    // Step 2: Get OAuth token from environment variables
    const oauthToken = process.env.LICHESS_OAUTH_TOKEN;
    if (!oauthToken) {
      return NextResponse.json(
        { error: 'OAuth token not configured' },
        { status: 500 }
      );
    }

    // Step 3: Prepare form data for challenge
    const formData = new URLSearchParams();
    
    // Add challenge parameters
    if (challengeParams.rated !== undefined) {
      formData.append('rated', challengeParams.rated.toString());
    }
    
    if (challengeParams.clockLimit !== undefined && challengeParams.clockIncrement !== undefined) {
      formData.append('clock.limit', challengeParams.clockLimit.toString());
      formData.append('clock.increment', challengeParams.clockIncrement.toString());
    }
    
    if (challengeParams.days !== undefined) {
      formData.append('days', challengeParams.days.toString());
    }
    
    if (challengeParams.color) {
      formData.append('color', challengeParams.color);
    }
    
    if (challengeParams.variant) {
      formData.append('variant', challengeParams.variant);
    }
    
    if (challengeParams.fen) {
      formData.append('fen', challengeParams.fen);
    }

    // Step 4: Create challenge using Lichess API
    const challengeResponse = await axios.post(
      `https://lichess.org/api/challenge/${username}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (challengeResponse.status === 200) {
      const challengeId = challengeResponse.data?.challenge?.id;
      const lichessUrl = challengeId ? `https://lichess.org/${challengeId}` : null;
      
      return NextResponse.json({
        success: true,
        challenge: challengeResponse.data,
        lichessUrl: lichessUrl,
        message: `Challenge sent successfully to ${username}!`
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create challenge' },
        { status: challengeResponse.status }
      );
    }
  } catch (error: any) {
    console.error('Error creating challenge:', error);
    
    if (error.response?.status === 400) {
      return NextResponse.json(
        { error: error.response.data?.error || 'Invalid challenge parameters' },
        { status: 400 }
      );
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create challenge' },
      { status: 500 }
    );
  }
}