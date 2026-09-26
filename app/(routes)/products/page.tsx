import ProductsPage from '@/_components/Shop/ProductsPage'
import { getProducts, getBrands } from '@/API/Shop/shopApi'
import { getCategories } from '@/API/CategoryAPI/getspecificcategory'
import type { Products } from '@/interfaces/products'
import type { Brand } from '@/interfaces/shop'
import type { Category } from '@/interfaces/category'

type SearchParams = Promise<{ category?: string; brand?: string; subcategory?: string; search?: string }>

export default async function ProductsRoute({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams
  let products: Products[] = []
  let categories: Category[] = []
  let brands: Brand[] = []
  let loadError = ''
  try {
    [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()])
  } catch {
    loadError = 'Could not load products. Please try again.'
  }
  const pageKey = [filters.search, filters.category, filters.brand, filters.subcategory].filter(Boolean).join('-') || 'all-products'
  return <ProductsPage key={pageKey} products={products} categories={categories} brands={brands} loadError={loadError} initialCategory={filters.category} initialBrand={filters.brand} initialSubcategory={filters.subcategory} initialSearch={filters.search} />
}
