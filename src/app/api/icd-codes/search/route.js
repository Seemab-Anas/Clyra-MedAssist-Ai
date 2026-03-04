import { NextResponse } from 'next/server';
import ICD10Code from '@/models/ICD10Code';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const results = await ICD10Code.search(query.trim(), limit);

    return NextResponse.json({
      success: true,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('ICD-10 search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}
