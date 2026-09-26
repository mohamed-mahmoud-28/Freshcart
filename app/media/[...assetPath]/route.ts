import { NextRequest, NextResponse } from 'next/server'
import { externalMediaUrl } from '@/API/server'

export async function GET(request: NextRequest, context: { params: Promise<{ assetPath: string[] }> }) {
  const { assetPath } = await context.params
  const sourceUrl = externalMediaUrl(assetPath, request.nextUrl.search)
  if (!sourceUrl) {
    return NextResponse.json({ message: 'Image not found.' }, { status: 404 })
  }

  try {
    const upstream = await fetch(sourceUrl, { cache: 'force-cache', next: { revalidate: 86400 } })
    if (!upstream.ok) return NextResponse.json({ message: 'Image not found.' }, { status: upstream.status === 404 ? 404 : 502 })
    const contentType = upstream.headers.get('content-type')
    if (!contentType?.startsWith('image/')) return NextResponse.json({ message: 'Image not found.' }, { status: 404 })
    return new NextResponse(upstream.body, { headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', 'X-Content-Type-Options': 'nosniff' } })
  } catch {
    return NextResponse.json({ message: 'Could not load image.' }, { status: 502 })
  }
}
