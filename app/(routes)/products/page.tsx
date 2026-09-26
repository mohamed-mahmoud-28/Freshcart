import ProductsPage from '@/_components/Shop/ProductsPage'

type SearchParams = Promise<{ category?: string; brand?: string; subcategory?: string; search?: string }>

export default async function ProductsRoute({ searchParams }: { searchParams: SearchParams }) {
  const filters = await searchParams
  const pageKey = [filters.search, filters.category, filters.brand, filters.subcategory].filter(Boolean).join('-') || 'all-products'
  return <ProductsPage key={pageKey} initialCategory={filters.category} initialBrand={filters.brand} initialSubcategory={filters.subcategory} initialSearch={filters.search} />
}
