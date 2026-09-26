import { deleteReviewWithToken, updateReviewWithToken } from '@/API/Reviews/reviewsApi'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId, rejectCrossOriginRequest } from '@/utilities/apiSecurity'

async function getAccessToken(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  return typeof session?.token === 'string' ? session.token : null
}

type Context = { params: Promise<{ reviewId: string }> }

export async function PUT(request: NextRequest, { params }: Context) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const token = await getAccessToken(request)
  if (!token) return NextResponse.json({ message: 'Please sign in to edit this review.' }, { status: 401 })
  const { reviewId } = await params
  if (!isValidObjectId(reviewId)) return NextResponse.json({ message: 'A valid review ID is required.' }, { status: 400 })
  const body = await request.json().catch(() => null) as { review?: string; rating?: number } | null
  const review = body?.review?.trim()
  const rating = body?.rating
  if (!review || review.length > 2000 || typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ message: 'A review and rating from 1 to 5 are required.' }, { status: 400 })
  }
  try {
    return NextResponse.json(await updateReviewWithToken(token, reviewId, review, rating))
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 502
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to update review' }, { status })
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const token = await getAccessToken(request)
  if (!token) return NextResponse.json({ message: 'Please sign in to delete this review.' }, { status: 401 })
  const { reviewId } = await params
  if (!isValidObjectId(reviewId)) return NextResponse.json({ message: 'A valid review ID is required.' }, { status: 400 })
  try {
    return NextResponse.json(await deleteReviewWithToken(token, reviewId))
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 502
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to delete review' }, { status })
  }
}
