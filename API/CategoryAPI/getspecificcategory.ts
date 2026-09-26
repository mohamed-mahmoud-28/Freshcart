import 'server-only'
import type { Category } from '@/interfaces/category'
import type { Subcategory } from '@/interfaces/shop'

const API_URL = (process.env.API ?? 'https://ecommerce.routemisr.com/api/v1').replace(/\/+$/, '')

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCategory(value: unknown): value is Category {
  if (!isObject(value)) return false
  if (typeof value._id !== 'string' || !/^[a-f\d]{24}$/i.test(value._id)) return false
  if (typeof value.name !== 'string' || value.name.length > 150 || typeof value.slug !== 'string' || value.slug.length > 180) return false
  if (typeof value.image !== 'string' || value.image.length > 1000) return false

  try {
    return new URL(value.image).hostname === 'ecommerce.routemisr.com' && new URL(value.image).protocol === 'https:'
  } catch {
    return false
  }
}

function isSubcategory(value: unknown): value is Subcategory {
  if (!isObject(value) || typeof value._id !== 'string' || !/^[a-f\d]{24}$/i.test(value._id)) return false
  if (typeof value.name !== 'string' || typeof value.slug !== 'string') return false
  if (typeof value.category === 'string') return /^[a-f\d]{24}$/i.test(value.category)
  return isObject(value.category) && typeof value.category._id === 'string' && /^[a-f\d]{24}$/i.test(value.category._id) && typeof value.category.name === 'string'
}

async function getCategoryData<T>(path: string, validate: (value: unknown) => boolean): Promise<T> {
  if (!path.startsWith('/categories') || path.includes('..') || path.includes('://')) {
    throw new Error('Invalid category API path.')
  }

  const response = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(8000),
  })
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new Error(isObject(payload) && typeof payload.message === 'string' ? payload.message : 'Could not load categories.')
  if (!isObject(payload) || !('data' in payload) || !validate(payload.data)) throw new Error('The category service returned invalid data.')
  return payload.data as T
}

export async function getCategories(): Promise<Category[]> {
  return getCategoryData<Category[]>('/categories', value => Array.isArray(value) && value.every(isCategory))
}

export async function getCategoryById(id: string): Promise<Category> {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new Error('Invalid category ID.')
  return getCategoryData<Category>(`/categories/${encodeURIComponent(id)}`, isCategory)
}

export async function getCategorySubcategoriesById(id: string): Promise<Subcategory[]> {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new Error('Invalid category ID.')
  return getCategoryData<Subcategory[]>(`/categories/${encodeURIComponent(id)}/subcategories`, value => Array.isArray(value) && value.every(isSubcategory))
}
