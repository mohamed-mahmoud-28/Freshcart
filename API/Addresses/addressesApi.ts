import 'server-only'
import { routeApiUrl, safeExternalStatus } from '@/API/server'

export type AddressRecord = { _id: string; name?: string; details?: string; city?: string; phone?: string }
export type AddressesResponse = { data?: AddressRecord[]; message?: string }

export async function getAddressesWithToken(token: string): Promise<AddressesResponse> {
  const response = await fetch(routeApiUrl('/addresses'), { headers: { token }, cache: 'no-store' })
  const payload = await response.json().catch(() => null) as AddressesResponse | null
  if (!response.ok) {
    const error = new Error('Could not load your addresses.')
    Object.assign(error, { status: safeExternalStatus(response.status) })
    throw error
  }
  return payload ?? { data: [] }
}
