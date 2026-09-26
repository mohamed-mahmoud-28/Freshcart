import { addToWishlistWithToken, getWishlistWithToken, removeFromWishlistWithToken } from '@/API/Wishlist/wishlistApi'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedToken, isValidObjectId, rejectCrossOriginRequest } from '@/utilities/apiSecurity'

export async function GET(request: NextRequest) {
  const token = await getAuthenticatedToken(request)
  if (!token) return NextResponse.json({ message: 'Please sign in to view your wishlist.' }, { status: 401 })

  try {
    return NextResponse.json(await getWishlistWithToken(token))
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 502
    const message = error instanceof Error ? error.message : 'Failed to load wishlist'
    return NextResponse.json({ message }, { status })
  }
}

export async function POST(request: NextRequest) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const token = await getAuthenticatedToken(request)
  if (!token) return NextResponse.json({ message: 'Please sign in to save favorites.' }, { status: 401 })

  const body = await request.json().catch(() => null) as { productId?: string } | null
  const productId = body?.productId?.trim()
  if (!isValidObjectId(productId)) return NextResponse.json({ message: 'A valid product ID is required.' }, { status: 400 })

  try {
    return NextResponse.json(await addToWishlistWithToken(token, productId))
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 502
    const message = error instanceof Error ? error.message : 'Failed to save favorite'
    return NextResponse.json({ message }, { status })
  }
}

export async function DELETE(request: NextRequest) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const token = await getAuthenticatedToken(request)
  if (!token) return NextResponse.json({ message: 'Please sign in to edit your wishlist.' }, { status: 401 })

  const productId = request.nextUrl.searchParams.get('productId')?.trim()
  if (!isValidObjectId(productId)) return NextResponse.json({ message: 'A valid product ID is required.' }, { status: 400 })

  try {
    return NextResponse.json(await removeFromWishlistWithToken(token, productId))
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 502
    const message = error instanceof Error ? error.message : 'Failed to remove favorite'
    return NextResponse.json({ message }, { status })
  }
}
