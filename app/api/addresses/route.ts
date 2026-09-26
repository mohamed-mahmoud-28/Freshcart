import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId, rejectCrossOriginRequest } from '@/utilities/apiSecurity'
import { routeApiUrl, safeExternalStatus } from '@/API/server'

const API = routeApiUrl('/addresses')
async function proxyRequest(req: NextRequest, method: 'GET' | 'POST' | 'DELETE', body?: unknown) {
  if (method !== 'GET') {
    const originError = rejectCrossOriginRequest(req)
    if (originError) return originError
  }
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (typeof session?.token !== 'string') return NextResponse.json({ message: 'Please sign in to manage addresses.' }, { status: 401 })
  const addressId = method === 'DELETE' && body && typeof body === 'object' && 'addressId' in body ? (body as { addressId?: unknown }).addressId : undefined
  if (method === 'POST') {
    const address = body as { name?: unknown; details?: unknown; city?: unknown; phone?: unknown } | null
    if (!address || typeof address.name !== 'string' || address.name.trim().length < 2 || address.name.length > 80 || typeof address.details !== 'string' || address.details.trim().length < 3 || address.details.length > 300 || typeof address.city !== 'string' || !address.city.trim() || address.city.length > 100 || typeof address.phone !== 'string' || !/^[0-9+() -]{7,20}$/.test(address.phone)) {
      return NextResponse.json({ message: 'Enter a valid name, street address, city, and phone number.' }, { status: 400 })
    }
    body = { name: address.name.trim(), details: address.details.trim(), city: address.city.trim(), phone: address.phone.trim() }
  }
  if (method === 'DELETE' && !isValidObjectId(addressId)) {
    return NextResponse.json({ message: 'A valid address ID is required.' }, { status: 400 })
  }
  try {
    const response = await fetch(method === 'DELETE' ? `${API}/${encodeURIComponent(addressId as string)}` : API, { method, headers: { token: session.token, 'Content-Type': 'application/json' }, ...(body && method !== 'DELETE' ? { body: JSON.stringify(body) } : {}), cache: 'no-store' })
    const payload = await response.json().catch(() => null)
    if (!response.ok) return NextResponse.json({ message: 'Could not update your saved addresses.' }, { status: safeExternalStatus(response.status) })
    return NextResponse.json(payload ?? {}, { status: response.status })
  } catch {
    return NextResponse.json({ message: 'Could not reach the address service.' }, { status: 502 })
  }
}
export async function GET(req: NextRequest) { return proxyRequest(req, 'GET') }
export async function POST(req: NextRequest) { return proxyRequest(req, 'POST', await req.json().catch(() => null)) }
export async function DELETE(req: NextRequest) { return proxyRequest(req, 'DELETE', await req.json().catch(() => null)) }

// The Route API does not document an address update endpoint. Create the new
// address first, then remove the old one so a failed save never loses old data.
export async function PUT(req: NextRequest) {
  const originError = rejectCrossOriginRequest(req)
  if (originError) return originError
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (typeof session?.token !== 'string') return NextResponse.json({ message: 'Please sign in to manage addresses.' }, { status: 401 })

  const body = await req.json().catch(() => null) as { addressId?: string; name?: string; details?: string; city?: string; phone?: string } | null
  if (!isValidObjectId(body?.addressId) || !body?.name?.trim() || body.name.length > 80 || !body.details?.trim() || body.details.length > 300 || !body.city?.trim() || body.city.length > 100 || !body.phone?.trim() || !/^[0-9+() -]{7,20}$/.test(body.phone)) {
    return NextResponse.json({ message: 'Enter a name, street address, city, and phone number.' }, { status: 400 })
  }

  const headers = { token: session.token, 'Content-Type': 'application/json' }
  const addressData = { name: body.name.trim(), details: body.details.trim(), city: body.city.trim(), phone: body.phone.trim() }

  try {
    const beforeResponse = await fetch(API, { headers, cache: 'no-store' })
    const beforePayload = await beforeResponse.json().catch(() => null) as { data?: { _id?: string }[] } | null
    if (!beforeResponse.ok) return NextResponse.json({ message: 'Could not verify your saved addresses before editing.' }, { status: safeExternalStatus(beforeResponse.status) })
    const previousIds = new Set((beforePayload?.data ?? []).map(address => address._id).filter((id): id is string => Boolean(id)))

    const createResponse = await fetch(API, { method: 'POST', headers, body: JSON.stringify(addressData), cache: 'no-store' })
    const createdAddress = await createResponse.json().catch(() => null) as { data?: { _id?: string } | { _id?: string }[]; _id?: string; message?: string } | null
    if (!createResponse.ok) return NextResponse.json({ message: 'Could not save the updated address.' }, { status: safeExternalStatus(createResponse.status) })

    const returnedAddresses = Array.isArray(createdAddress?.data) ? createdAddress.data : []
    let newAddressId = (Array.isArray(createdAddress?.data) ? undefined : createdAddress?.data?._id) ?? createdAddress?._id
    newAddressId ??= returnedAddresses.find(address => address._id && !previousIds.has(address._id))?._id

    if (!newAddressId) {
      const afterResponse = await fetch(API, { headers, cache: 'no-store' })
      const afterPayload = await afterResponse.json().catch(() => null) as { data?: { _id?: string; name?: string; details?: string; city?: string; phone?: string }[] } | null
      if (afterResponse.ok) {
        newAddressId = afterPayload?.data?.find(address => address._id && !previousIds.has(address._id) && address.name === addressData.name && address.details === addressData.details && address.city === addressData.city && address.phone === addressData.phone)?._id
      }
    }

    if (!newAddressId) return NextResponse.json({ message: 'The new address was saved, but its ID was missing. Please check your saved addresses.' }, { status: 502 })

    const deleteResponse = await fetch(`${API}/${encodeURIComponent(body.addressId)}`, { method: 'DELETE', headers, cache: 'no-store' })
    if (!deleteResponse.ok) {
      const rollbackResponse = await fetch(`${API}/${encodeURIComponent(newAddressId)}`, { method: 'DELETE', headers, cache: 'no-store' }).catch(() => null)
      return NextResponse.json({ message: rollbackResponse?.ok
        ? 'Could not replace the address. Your original address was kept.'
        : 'The updated address was saved, but the old address could not be removed. Please refresh and remove the duplicate if needed.' }, { status: 502 })
    }

    return NextResponse.json(createdAddress)
  } catch {
    return NextResponse.json({ message: 'Could not reach the address service. Your previous address was kept if it had not yet been removed.' }, { status: 502 })
  }
}
