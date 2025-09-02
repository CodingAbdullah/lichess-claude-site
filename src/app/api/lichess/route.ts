import { NextResponse } from 'next/server';
import axios from 'axios';

// Custom backend API route for fetching account and status data
// GET /api/lichess
export async function GET() {
  try {
    // Fetch account information
    const accountResponse = await axios.get('https://lichess.org/api/account', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LICHESS_API_KEY}`
      },
    });

    // Fetch status information
    const statusResponse = await axios.get(`https://lichess.org/api/users/status?ids=${process.env.LICHESS_ACCOUNT_ID}`);

    const data = {
      account: accountResponse.data,
      status: statusResponse.data[0],
    };

    return NextResponse.json(data);
  } 
  catch (error) {
    return NextResponse.json({ 
      error }, 
      { 
        status: 500 
      });
  }
}