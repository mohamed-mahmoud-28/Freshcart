import { addReviewWithToken, getAllReviews } from '@/API/Reviews/reviewsApi'
import { getProductReviews } from '@/API/Shop/shopApi'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedToken, isValidObjectId, rejectCrossOriginRequest } from '@/utilities/apiSecurity'

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  try {
    const reviews = productId ? await getProductReviews(productId) : await getAllReviews()
    return NextResponse.json({ data: reviews })
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to load reviews' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const token = await getAuthenticatedToken(request)
  if (!token) return NextResponse.json({ message: 'Please sign in to write a review.' }, { status: 401 })

  const body = await request.json().catch(() => null) as { productId?: string; review?: string; rating?: number } | null
  const productId = body?.productId?.trim()
  const review = body?.review?.trim()
  const rating = body?.rating
  if (!isValidObjectId(productId) || !review || review.length > 2000 || typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ message: 'A product, review, and rating from 1 to 5 are required.' }, { status: 400 })
  }

  try {
    return NextResponse.json(await addReviewWithToken(token, productId, review, rating))
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 502
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to add review' }, { status })
  }
}
