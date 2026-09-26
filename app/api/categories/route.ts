import { getCategories } from '@/API/CategoryAPI/getspecificcategory'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ data: await getCategories() })
  } catch {
    return NextResponse.json({ message: 'Could not load categories. Please try again.' }, { status: 502 })
  }
}
