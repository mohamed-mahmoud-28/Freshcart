import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function getAuthenticatedToken(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  return typeof session?.token === 'string' && session.token ? session.token : null
}

export function isValidObjectId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
}

// Custom API routes use the NextAuth cookie, so reject cross-site requests that
// could otherwise try to make a signed-in browser change account data.
export function rejectCrossOriginRequest(request: NextRequest) {
  const source = request.headers.get('origin') ?? request.headers.get('referer')
  if (!source) return NextResponse.json({ message: 'Request origin could not be verified.' }, { status: 403 })

  try {
    if (new URL(source).origin !== new URL(request.url).origin) {
      return NextResponse.json({ message: 'Cross-origin requests are not allowed.' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ message: 'Request origin is invalid.' }, { status: 403 })
  }

  return null
}
