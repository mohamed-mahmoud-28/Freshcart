import { addProductWithToken, applyCouponWithToken, CartApiError, deleteCartWithToken, getCartWithToken, updateCartItemWithToken } from '@/API/Cart/cartApi'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedToken, isValidObjectId, rejectCrossOriginRequest } from '@/utilities/apiSecurity'

async function getAccessToken(request: NextRequest) {
    return getAuthenticatedToken(request)
}

export async function GET(request: NextRequest) {
    const token = await getAccessToken(request)
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    try {
        return NextResponse.json(await getCartWithToken(token))
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get cart'
        const status = error instanceof CartApiError ? error.status : 502
        return NextResponse.json({ message }, { status })
    }
}

export async function PATCH(request: NextRequest) {
    const originError = rejectCrossOriginRequest(request)
    if (originError) return originError
    const token = await getAccessToken(request)
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null) as { productId?: string; count?: number } | null
    const productId = body?.productId
    const count = body?.count
    if (!isValidObjectId(productId) || typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > 99) {
        return NextResponse.json({ message: 'A product ID and positive quantity are required' }, { status: 400 })
    }

    try {
        return NextResponse.json(await updateCartItemWithToken(token, productId, count))
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update cart'
        const status = error instanceof CartApiError ? error.status : 502
        return NextResponse.json({ message }, { status })
    }
}

export async function POST(request: NextRequest) {
    const originError = rejectCrossOriginRequest(request)
    if (originError) return originError
    const token = await getAccessToken(request)
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null) as { coupon?: string; productId?: string } | null
    if (body?.productId !== undefined) {
        if (!isValidObjectId(body.productId)) return NextResponse.json({ message: 'A valid product ID is required.' }, { status: 400 })
        try { return NextResponse.json(await addProductWithToken(token, body.productId)) }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add product'
            const status = error instanceof CartApiError ? error.status : 502
            return NextResponse.json({ message }, { status })
        }
    }
    const coupon = body?.coupon?.trim()
    if (!coupon) {
        return NextResponse.json({ message: 'Enter a promo code first.' }, { status: 400 })
    }

    try {
        return NextResponse.json(await applyCouponWithToken(token, coupon))
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to apply promo code'
        const status = error instanceof CartApiError ? error.status : 502
        return NextResponse.json({ message }, { status })
    }
}

export async function DELETE(request: NextRequest) {
    const originError = rejectCrossOriginRequest(request)
    if (originError) return originError
    const token = await getAccessToken(request)
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null) as { productId?: string } | null
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return NextResponse.json({ message: 'Invalid delete request' }, { status: 400 })
    }
    if (body?.productId !== undefined && !isValidObjectId(body.productId)) {
        return NextResponse.json({ message: 'Product ID must be valid' }, { status: 400 })
    }

    try {
        return NextResponse.json(await deleteCartWithToken(token, body?.productId))
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete cart items'
        const status = error instanceof CartApiError ? error.status : 502
        return NextResponse.json({ message }, { status })
    }
}
