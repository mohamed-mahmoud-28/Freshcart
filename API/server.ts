import 'server-only'

const configuredApi = (process.env.API ?? 'https://ecommerce.routemisr.com/api').replace(/\/+$/, '').replace(/\/v[12]$/, '')
const externalOrigin = new URL(configuredApi).origin
const mediaPrefixes = ['/Route-Academy-products/', '/Route-Academy-categories/', '/Route-Academy-brands/']

function isAllowedMediaPath(pathname: string) {
  return mediaPrefixes.some(prefix => pathname.startsWith(prefix))
}

export function routeApiUrl(path: string, version: 1 | 2 = 1) {
  return `${configuredApi}/v${version}${path.startsWith('/') ? path : `/${path}`}`
}

export function isExternalMediaUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.origin === externalOrigin && isAllowedMediaPath(url.pathname)
  } catch {
    return false
  }
}

export function externalMediaUrl(assetPath: string[], search = '') {
  if (!assetPath.length || assetPath.some(part => !/^[\w.-]+$/.test(part) || part === '.' || part === '..')) return null
  const url = new URL(`/${assetPath.map(encodeURIComponent).join('/')}`, externalOrigin)
  url.search = search
  return isAllowedMediaPath(url.pathname) ? url.toString() : null
}

export function internalizeMedia<T>(value: T): T {
  if (typeof value === 'string') {
    try {
      const url = new URL(value)
      if (isExternalMediaUrl(value)) {
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
