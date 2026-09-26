import 'server-only'

const configuredApi = (process.env.API ?? 'https://ecommerce.routemisr.com/api').replace(/\/+$/, '').replace(/\/v[12]$/, '')

export function routeApiUrl(path: string, version: 1 | 2 = 1) {
  return `${configuredApi}/v${version}${path.startsWith('/') ? path : `/${path}`}`
}

const mediaHost = 'ecommerce.routemisr.com'
const mediaPrefixes = ['/Route-Academy-products/', '/Route-Academy-categories/', '/Route-Academy-brands/']

export function internalizeMedia<T>(value: T): T {
  if (typeof value === 'string') {
    try {
      const url = new URL(value)
      if (url.protocol === 'https:' && url.hostname === mediaHost && mediaPrefixes.some(prefix => url.pathname.startsWith(prefix))) {
        return `/media${url.pathname}${url.search}` as T
      }
    } catch {
      // Leave ordinary text values untouched.
    }
    return value
  }
  if (Array.isArray(value)) return value.map(item => internalizeMedia(item)) as T
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, internalizeMedia(item)])) as T
  }
  return value
}

export function safeExternalStatus(status: number) {
  return [400, 401, 403, 404, 409, 422, 429].includes(status) ? status : 502
}
