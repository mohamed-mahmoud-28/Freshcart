import 'server-only'
import { internalizeMedia, routeApiUrl, safeExternalStatus } from '@/API/server'

export async function getOrdersWithToken(token: string, userId: string) {
  const response = await fetch(`${routeApiUrl('/orders')}/user/${encodeURIComponent(userId)}`, {
    headers: { token },
    cache: 'no-store',
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error('Could not load your orders.')
    Object.assign(error, { status: safeExternalStatus(response.status) })
    throw error
  }
  return internalizeMedia(payload)
}
