import 'server-only'
import { internalizeMedia, routeApiUrl, safeExternalStatus } from '@/API/server'
import type { WishlistResponse } from '@/interfaces/shop'

async function wishlistRequest(token: string, path = '', init: RequestInit = {}) {
  const response = await fetch(routeApiUrl(`/wishlist${path}`), {
    ...init,
    headers: { token, 'Content-Type': 'application/json', ...init.headers },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error('Wishlist request failed')
    Object.assign(error, { status: safeExternalStatus(response.status) })
    throw error
  }
  return internalizeMedia(payload) as WishlistResponse
}

export function getWishlistWithToken(token: string) {
  return wishlistRequest(token)
}

export function addToWishlistWithToken(token: string, productId: string) {
  return wishlistRequest(token, '', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })
}

export function removeFromWishlistWithToken(token: string, productId: string) {
  return wishlistRequest(token, `/${encodeURIComponent(productId)}`, { method: 'DELETE' })
}
