import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId, rejectCrossOriginRequest } from '@/utilities/apiSecurity'
import { internalizeMedia, routeApiUrl } from '@/API/server'
import { getOrdersWithToken } from '@/API/Orders/ordersApi'

async function auth(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  return { token: typeof session?.token === 'string' ? session.token : '', userId: typeof session?.id === 'string' ? session.id : '' }
}

export async function GET(request: NextRequest) {
  const { token, userId } = await auth(request)
  if (!token || !userId) return NextResponse.json({ message: 'Please sign in to view your orders.' }, { status: 401 })
  try {
    return NextResponse.json(await getOrdersWithToken(token, userId))
  } catch {
    return NextResponse.json({ message: 'Could not reach the orders service.' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const { token } = await auth(request)
  if (!token) return NextResponse.json({ message: 'Please sign in to checkout.' }, { status: 401 })
  const body = await request.json().catch(() => null) as { cartId?: string; payment?: string; shippingAddress?: { details?: string; phone?: string; city?: string } } | null
  if (!isValidObjectId(body?.cartId) || typeof body.shippingAddress?.details !== 'string' || body.shippingAddress.details.trim().length < 3 || body.shippingAddress.details.length > 300 || typeof body.shippingAddress.phone !== 'string' || !/^[0-9+() -]{7,20}$/.test(body.shippingAddress.phone) || typeof body.shippingAddress.city !== 'string' || !body.shippingAddress.city.trim() || body.shippingAddress.city.length > 100) {
    return NextResponse.json({ message: 'Add complete shipping details before continuing.' }, { status: 400 })
  }
  if (body.payment !== 'cash' && body.payment !== 'online') {
    return NextResponse.json({ message: 'Choose a supported payment method.' }, { status: 400 })
  }
  const origin = new URL(request.url).origin
  const online = body.payment === 'online'
  const checkoutUrl = new URL(online ? routeApiUrl(`/checkout-session/${encodeURIComponent(body.cartId)}`, 1) : routeApiUrl(`/orders/${encodeURIComponent(body.cartId)}`, 2))
  if (online) checkoutUrl.searchParams.set('url', origin)
  try {
    const response = await fetch(checkoutUrl, { method: 'POST', headers: { token, 'Content-Type': 'application/json' }, body: JSON.stringify({ shippingAddress: { details: body.shippingAddress.details.trim(), phone: body.shippingAddress.phone.trim(), city: body.shippingAddress.city.trim() } }), cache: 'no-store' })
    const payload = await response.json().catch(() => null)
    if (!response.ok) return NextResponse.json({ message: response.status >= 500 ? 'Checkout could not be started. Please try again.' : payload?.message ?? 'Checkout could not be started.' }, { status: response.status >= 500 ? 502 : response.status })
    return NextResponse.json(internalizeMedia(payload ?? { message: 'Checkout could not be started.' }), { status: response.status })
  } catch {
    return NextResponse.json({ message: 'Could not reach the checkout service.' }, { status: 502 })
  }
}
