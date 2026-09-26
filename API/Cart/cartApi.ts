import 'server-only'
import { internalizeMedia, routeApiUrl, safeExternalStatus } from '@/API/server'
import type { CartResponse } from '@/interfaces/cart'

export class CartApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'CartApiError'
  }
}

async function requestCart<T>(token: string, path = '', init: RequestInit = {}): Promise<T> {
  const response = await fetch(routeApiUrl(`/cart${path}`, 2), {
    ...init,
    headers: { token, 'Content-Type': 'application/json', ...init.headers },
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) throw new CartApiError('Cart request failed', safeExternalStatus(response.status))
  return internalizeMedia(payload) as T
}

export function getCartWithToken(token: string) {
  return requestCart<CartResponse>(token)
}

export function updateCartItemWithToken(token: string, productId: string, count: number) {
  return requestCart<CartResponse>(token, `/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    body: JSON.stringify({ count }),
  })
}

export function addProductWithToken(token: string, productId: string) {
  return requestCart<CartResponse>(token, '', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })
}

export function applyCouponWithToken(token: string, coupon: string) {
  return requestCart<CartResponse>(token, '/applyCoupon', {
    method: 'PUT',
    body: JSON.stringify({ coupon }),
  })
}

export function deleteCartWithToken(token: string, productId?: string) {
  const path = productId ? `/${encodeURIComponent(productId)}` : ''
  return requestCart<CartResponse>(token, path, { method: 'DELETE' })
}
