import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { rejectCrossOriginRequest } from '@/utilities/apiSecurity'
import { routeApiUrl } from '@/API/server'

const API = routeApiUrl('/users')

async function updateAccount(request: NextRequest, path: string, body: unknown) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (typeof session?.token !== 'string') return NextResponse.json({ message: 'Please sign in to update your account.' }, { status: 401 })
  try {
    const response = await fetch(`${API}${path}`, { method: 'PUT', headers: { token: session.token, 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' })
    const payload = await response.json().catch(() => null)
    return NextResponse.json({ status: payload?.status, message: response.status >= 500 ? 'Could not update your account. Please try again.' : payload?.message }, { status: response.status >= 500 ? 502 : response.status, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ message: 'Could not reach the account service.' }, { status: 502 })
  }
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 100 || typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) || (body.phone !== undefined && (typeof body.phone !== 'string' || !/^[0-9+() -]{7,20}$/.test(body.phone)))) {
    return NextResponse.json({ message: 'Enter a valid name and email address.' }, { status: 400 })
  }
  return updateAccount(request, '/updateMe/', { name: body.name.trim(), email: body.email.trim(), phone: body.phone })
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.currentPassword !== 'string' || body.currentPassword.length < 6 || typeof body.password !== 'string' || body.password.length < 6 || body.password.length > 128 || body.password !== body.rePassword) {
    return NextResponse.json({ message: 'Enter your current password and matching new passwords (at least 6 characters).' }, { status: 400 })
  }
  return updateAccount(request, '/changeMyPassword', body)
}
