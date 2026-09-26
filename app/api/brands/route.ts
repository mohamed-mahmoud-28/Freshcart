import { getBrands } from '@/API/Shop/shopApi'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ data: await getBrands() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ message: 'Could not load brands. Please try again.' }, { status: 502 })
  }
}
