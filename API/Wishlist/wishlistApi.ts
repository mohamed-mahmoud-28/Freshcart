import type { Products } from '@/interfaces/products'
import type { WishlistResponse } from '@/interfaces/shop'

const API_URL = 'https://ecommerce.routemisr.com/api/v1/wishlist'

async function wishlistRequest(token: string, path = '', init: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { token, 'Content-Type': 'application/json', ...init.headers },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(payload?.message ?? 'Wishlist request failed')
    Object.assign(error, { status: response.status })
    throw error
  }
  return payload as WishlistResponse
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

export function getWishlistProducts(response: WishlistResponse): Products[] {
  if (Array.isArray(response.data)) return response.data
  return response.data?.products ?? []
}
