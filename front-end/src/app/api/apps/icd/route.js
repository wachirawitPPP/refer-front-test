// Next Imports
import { NextResponse } from 'next/server';
// import { icd } from '@/app/api/fake-db/apps/icd';
import disease from '@/data/disease.json'

export async function POST(request) {
  try {
    // Parse the request body as JSON
    const { query } = await request.json();

    // Validate that query is at least 1 character long
    if (typeof query !== 'string' || query.length < 3) {
      return NextResponse.json({ message: 'Query must be at least 1 character long' }, { status: 400 });
    }

    // Map and filter the disease data
    const diseaseMap = disease
      .filter(item => item && item.id && item.code && item.name_th && item.name_en) // Filter out invalid entries
      .map((item) => ({
        id: item.id,
        diagnostics_code: item.code,
        diagnostics_th: item.name_th,
        diagnostics_en: item.name_en,
        title: `${item.code} : ${item.name_th} : ${item.name_en}`
      }));

    const results = diseaseMap.filter(item =>
      //item.id.includes(query) || item.title.includes(query)
      item.id.includes(query) || item.title.includes(query) 
    );
    
    const limitedResults = results.slice(0, 50);

    return NextResponse.json(limitedResults);
    //return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid request format' }, { status: 400 });
  }
}
