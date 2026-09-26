import { getCategorySubcategoriesById } from '@/API/CategoryAPI/getspecificcategory'
import { isValidObjectId } from '@/utilities/apiSecurity'
import { NextRequest, NextResponse } from 'next/server'

type Context = { params: Promise<{ categoryId: string }> }

export async function GET(_request: NextRequest, { params }: Context) {
  const { categoryId } = await params
  if (!isValidObjectId(categoryId)) return NextResponse.json({ message: 'A valid category ID is required.' }, { status: 400 })

  try {
    return NextResponse.json({ data: await getCategorySubcategoriesById(categoryId) })
  } catch {
    return NextResponse.json({ message: 'Could not load this category’s subcategories. Please try again.' }, { status: 502 })
  }
}
