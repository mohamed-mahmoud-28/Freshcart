import { NextRequest, NextResponse } from 'next/server'

const allowedRoots = new Set(['Route-Academy-products', 'Route-Academy-categories', 'Route-Academy-brands'])

export async function GET(request: NextRequest, context: { params: Promise<{ assetPath: string[] }> }) {
  const { assetPath } = await context.params
  if (!assetPath.length || !allowedRoots.has(assetPath[0]) || assetPath.some(part => !/^[\w.-]+$/.test(part) || part === '.' || part === '..')) {
    return NextResponse.json({ message: 'Image not found.' }, { status: 404 })
  }

  try {
    const upstream = await fetch(`https://ecommerce.routemisr.com/${assetPath.map(encodeURIComponent).join('/')}`, { cache: 'force-cache', next: { revalidate: 86400 } })
    if (!upstream.ok) return NextResponse.json({ message: 'Image not found.' }, { status: upstream.status === 404 ? 404 : 502 })
    const contentType = upstream.headers.get('content-type')
    if (!contentType?.startsWith('image/')) return NextResponse.json({ message: 'Image not found.' }, { status: 404 })
    return new NextResponse(upstream.body, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', 'X-Content-Type-Options': 'nosniff' } })
  } catch {
    return NextResponse.json({ message: 'Could not load image.' }, { status: 502 })
  }
}
