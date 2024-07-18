import { NextResponse } from 'next/server'

// Data Imports
import { db } from '@/app/api/fake-db/apps/refer-list'

export async function GET() {
  return NextResponse.json(db)
}
