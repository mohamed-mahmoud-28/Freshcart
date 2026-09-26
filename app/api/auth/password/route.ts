import { NextRequest, NextResponse } from 'next/server'
import { rejectCrossOriginRequest } from '@/utilities/apiSecurity'
import { routeApiUrl } from '@/API/server'

const paths = { forgot: '/forgotPasswords', verify: '/verifyResetCode', reset: '/resetPassword' } as const

export async function POST(request: NextRequest) {
  const originError = rejectCrossOriginRequest(request)
  if (originError) return originError
  const body = await request.json().catch(() => null) as { step?: keyof typeof paths; email?: string; resetCode?: string; newPassword?: string } | null
  if (!body?.step || !paths[body.step]) return NextResponse.json({ message: 'Choose a valid password reset step.' }, { status: 400 })
  if (body.step === 'forgot' && (!body.email || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))) return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 })
  if (body.step === 'verify' && (!body.resetCode?.trim() || body.resetCode.length > 20)) return NextResponse.json({ message: 'Enter a valid verification code.' }, { status: 400 })
  if (body.step === 'reset' && (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || !body.newPassword || body.newPassword.length < 6 || body.newPassword.length > 128)) return NextResponse.json({ message: 'Enter a valid email and a password with at least 6 characters.' }, { status: 400 })
  const data = body.step === 'forgot' ? { email: body.email } : body.step === 'verify' ? { resetCode: body.resetCode } : { email: body.email, newPassword: body.newPassword }
  try {
    const response = await fetch(routeApiUrl(`/auth${paths[body.step]}`), { method: body.step === 'reset' ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), cache: 'no-store' })
    const payload = await response.json().catch(() => null)
    return NextResponse.json({ status: payload?.status, message: response.status >= 500 ? 'Could not complete the password request. Please try again.' : payload?.message }, { status: response.status >= 500 ? 502 : response.status, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ message: 'Could not reach the password service. Please try again.' }, { status: 502 })
  }
}
