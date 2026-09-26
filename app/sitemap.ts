import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return []

  const publicPages = ['', '/products', '/categories', '/brands', '/terms', '/privacy']
  return publicPages.map(path => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))
}
