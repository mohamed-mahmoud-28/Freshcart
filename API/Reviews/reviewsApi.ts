import 'server-only'
import { routeApiUrl, safeExternalStatus } from '@/API/server'
import type { Review } from '@/interfaces/products'

async function sendReviewRequest<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(routeApiUrl(path), {
    ...init,
    headers: { token, 'Content-Type': 'application/json', ...init.headers },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error('Review request failed')
    Object.assign(error, { status: safeExternalStatus(response.status) })
    throw error
  }
  return payload as T
}

export async function getAllReviews(): Promise<Review[]> {
  const response = await fetch(routeApiUrl('/reviews'), { cache: 'no-store' })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error('Failed to load reviews')
  return payload?.data ?? []
}

export function addReviewWithToken(token: string, productId: string, review: string, rating: number) {
  return sendReviewRequest(token, `/products/${encodeURIComponent(productId)}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ review, rating }),
  })
}

export function updateReviewWithToken(token: string, reviewId: string, review: string, rating: number) {
  return sendReviewRequest(token, `/reviews/${encodeURIComponent(reviewId)}`, {
    method: 'PUT',
    body: JSON.stringify({ review, rating }),
  })
}

export function deleteReviewWithToken(token: string, reviewId: string) {
  return sendReviewRequest(token, `/reviews/${encodeURIComponent(reviewId)}`, { method: 'DELETE' })
}
