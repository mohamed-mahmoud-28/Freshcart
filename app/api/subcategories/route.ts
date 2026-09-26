import { getSubcategories } from '@/API/Shop/shopApi'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ data: await getSubcategories() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ message: 'Could not load subcategories. Please try again.' }, { status: 502 })
  }
}
