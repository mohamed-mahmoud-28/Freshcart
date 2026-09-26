import type { Brand, Subcategory } from '@/interfaces/shop'
import type { Products, Review } from '@/interfaces/products'

const API_URL = 'https://ecommerce.routemisr.com/api/v1'

async function getData<T>(path: string, noCache = false): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, noCache ? { cache: 'no-store' } : { next: { revalidate: 300 } })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message ?? 'Failed to load data')
  return payload?.data as T
}

export function getProducts() {
  return getData<Products[]>('/products')
}

export function getProduct(id: string) {
  return getData<Products>(`/products/${encodeURIComponent(id)}`)
}

export function getBrands() {
  return getData<Brand[]>('/brands')
}

export function getBrand(id: string) {
  return getData<Brand>(`/brands/${encodeURIComponent(id)}`)
}

export function getSubcategories() {
  return getData<Subcategory[]>('/subcategories')
}

export function getSubcategory(id: string) {
  return getData<Subcategory>(`/subcategories/${encodeURIComponent(id)}`)
}

export function getProductReviews(id: string) {
  return getData<Review[]>(`/products/${encodeURIComponent(id)}/reviews`, true)
}
