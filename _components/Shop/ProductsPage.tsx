"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Grid2X2, List, Search, SlidersHorizontal } from 'lucide-react'
import type { Products } from '@/interfaces/products'
import type { Brand } from '@/interfaces/shop'
import type { Category } from '@/interfaces/category'
import ProductCard from '@/_components/Home/Products/ProductCard'

type Props = { products: Products[]; categories: Category[]; brands: Brand[]; loadError?: string; initialCategory?: string; initialBrand?: string; initialSubcategory?: string; initialSearch?: string }
type ProductFiltersProps = {
  idPrefix: string
  categories: Category[]
  brands: Brand[]
  search: string
  selectedCategory: string
  selectedBrand: string
  minPrice: string
  maxPrice: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onBrandChange: (value: string) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}

function ProductFilters({ idPrefix, categories, brands, search, selectedCategory, selectedBrand, minPrice, maxPrice, onSearchChange, onCategoryChange, onBrandChange, onMinPriceChange, onMaxPriceChange }: ProductFiltersProps) {
  return <>
    <h2 className="flex items-center gap-2 text-lg font-semibold"><SlidersHorizontal size={19} /> Categories & Filters</h2>
    {!search && <><label className="mt-5 block text-sm font-semibold text-[#344054]" htmlFor={`${idPrefix}-product-search`}>Search products</label><span className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-[#e5e9ee] px-3 text-[#98a2b3]"><Search size={17} /><input id={`${idPrefix}-product-search`} value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search products..." className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" /></span></>}
    <div className="mt-6 border-t border-[#edf0f2] pt-5"><h3 className="mb-3 text-sm font-semibold">Categories</h3><div className="grid max-h-64 gap-3 overflow-auto pr-1">{categories.map((category) => <label key={category._id} className="flex cursor-pointer items-center gap-3 text-sm text-[#596579] hover:text-[#079b48]"><input type="checkbox" checked={selectedCategory === category._id || selectedCategory === category.slug} onChange={() => onCategoryChange(selectedCategory === category._id || selectedCategory === category.slug ? '' : category._id)} className="size-4 accent-[#12a857]" />{category.name}</label>)}</div></div>
    <div className="mt-6 border-t border-[#edf0f2] pt-5"><h3 className="mb-3 text-sm font-semibold">Price Range (EGP)</h3><div className="grid grid-cols-2 gap-3"><label className="text-xs text-slate-500">Min<input type="number" min="0" value={minPrice} onChange={(event) => onMinPriceChange(event.target.value)} placeholder="0" className="mt-1.5 h-10 w-full rounded-lg border border-[#e5e9ee] px-3 text-sm outline-none focus:border-[#12a857]" /></label><label className="text-xs text-slate-500">Max<input type="number" min="0" value={maxPrice} onChange={(event) => onMaxPriceChange(event.target.value)} placeholder="No limit" className="mt-1.5 h-10 w-full rounded-lg border border-[#e5e9ee] px-3 text-sm outline-none focus:border-[#12a857]" /></label></div><div className="mt-3 flex flex-wrap gap-2">{[500, 1000, 5000, 10000].map((amount) => <button key={amount} type="button" onClick={() => { onMinPriceChange(''); onMaxPriceChange(String(amount)) }} className="rounded-full bg-[#f1f3f5] px-3 py-1.5 text-xs text-[#596579] transition hover:bg-[#e5f7eb] hover:text-[#078c43]">Under {amount >= 1000 ? `${amount / 1000}K` : amount}</button>)}</div></div>
    <div className="mt-6 border-t border-[#edf0f2] pt-5"><h3 className="mb-3 text-sm font-semibold">Brands</h3><div className="grid max-h-56 gap-3 overflow-auto pr-1">{brands.map((brand) => <label key={brand._id} className="flex cursor-pointer items-center gap-3 text-sm text-[#596579] hover:text-[#079b48]"><input type="checkbox" checked={selectedBrand === brand._id || selectedBrand === brand.slug} onChange={() => onBrandChange(selectedBrand === brand._id || selectedBrand === brand.slug ? '' : brand._id)} className="size-4 accent-[#12a857]" />{brand.name}</label>)}</div></div>
    <div className="mt-5 border-t border-[#edf0f2] pt-4"><h3 className="mb-2 text-xs font-semibold">Explore</h3><div className="grid gap-2 text-xs text-[#596579]"><Link href="/categories" className="hover:text-[#079b48]">All Categories</Link><Link href="/subcategories" className="hover:text-[#079b48]">Subcategories</Link><Link href="/brands" className="hover:text-[#079b48]">All Brands</Link></div></div>
  </>
}

export default function ProductsPage({ products, categories, brands, loadError = '', initialCategory = '', initialBrand = '', initialSubcategory = '', initialSearch = '' }: Props) {
  const [search, setSearch] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedBrand, setSelectedBrand] = useState(initialBrand)
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const isLoading = false

  const visibleProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesText = `${product.title} ${product.category.name} ${product.brand.name}`.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !selectedCategory || product.category._id === selectedCategory || product.category.slug === selectedCategory
      const matchesBrand = !selectedBrand || product.brand._id === selectedBrand || product.brand.slug === selectedBrand
      const matchesSubcategory = !selectedSubcategory || product.subcategory?.some((subcategory) => subcategory._id === selectedSubcategory || subcategory.slug === selectedSubcategory)
      const productPrice = product.priceAfterDiscount ?? product.price
      const matchesMinPrice = !minPrice || productPrice >= Number(minPrice)
      const matchesMaxPrice = !maxPrice || productPrice <= Number(maxPrice)
      return matchesText && matchesCategory && matchesBrand && matchesSubcategory && matchesMinPrice && matchesMaxPrice
    })

    if (sortBy === 'price-low') result = [...result].sort((a, b) => (a.priceAfterDiscount ?? a.price) - (b.priceAfterDiscount ?? b.price))
    if (sortBy === 'price-high') result = [...result].sort((a, b) => (b.priceAfterDiscount ?? b.price) - (a.priceAfterDiscount ?? a.price))
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    if (sortBy === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    if (sortBy === 'name-z') result = [...result].sort((a, b) => b.title.localeCompare(a.title))
    return result
  }, [products, search, selectedCategory, selectedBrand, selectedSubcategory, sortBy, minPrice, maxPrice])

  return (
    <main className="min-h-[calc(100vh-120px)] bg-[#fbfcfd] pb-12 text-[#172338]">
      {search ? (
        <header className="border-b border-[#edf0f2] bg-white px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-[1600px]">
            <nav className="mb-4 flex gap-2 text-sm text-[#8a95a7]"><Link href="/" className="hover:text-[#079b48]">Home</Link><span>/</span><span className="text-[#344054]">Search Results</span></nav>
            <form action="/products" method="get" className="relative mb-5 max-w-[840px]">
              <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
              <input name="search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" placeholder="Search for products..." className="h-[58px] w-full rounded-xl border border-[#e0e5eb] bg-white pl-12 pr-4 text-base text-[#344054] outline-none transition focus:border-[#12a857] focus:ring-4 focus:ring-[#12a857]/10" />
            </form>
            <h1 className="text-2xl font-bold tracking-tight text-[#172338] sm:text-[30px]">Search Results for &quot;{search}&quot;</h1>
            <p className="mt-2 text-base text-[#657184]">{isLoading ? 'Searching products…' : `We found ${visibleProducts.length} ${visibleProducts.length === 1 ? 'product' : 'products'} for you`}</p>
          </div>
        </header>
      ) : (
        <header className="bg-gradient-to-r from-[#119c4a] to-[#23c66b] px-4 py-8 text-white sm:px-8 lg:py-10">
          <div className="mx-auto max-w-[1600px]"><nav className="mb-4 flex gap-2 text-xs text-white/75"><Link href="/">Home</Link><span>/</span><span>All Products</span></nav><h1 className="text-3xl font-bold">All Products</h1><p className="mt-1 text-sm text-white/85">Explore our complete product collection</p></div>
        </header>
      )}

      <div className="mx-auto grid max-w-[1800px] gap-5 px-3 py-5 min-[480px]:px-4 sm:gap-7 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 lg:px-8 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-10">
        <details className="group h-fit rounded-2xl border border-[#edf0f2] bg-white shadow-sm lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold marker:hidden [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><SlidersHorizontal size={18} /> Filters</span><ChevronDown size={18} className="transition-transform group-open:rotate-180" /></summary>
          <div className="border-t border-[#edf0f2] p-4"><ProductFilters idPrefix="mobile" categories={categories} brands={brands} search={search} selectedCategory={selectedCategory} selectedBrand={selectedBrand} minPrice={minPrice} maxPrice={maxPrice} onSearchChange={setSearch} onCategoryChange={setSelectedCategory} onBrandChange={setSelectedBrand} onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice} /></div>
        </details>
        <aside className="sticky top-[104px] hidden h-fit rounded-2xl border border-[#edf0f2] bg-white p-5 shadow-sm lg:block xl:p-6">
          <ProductFilters idPrefix="desktop" categories={categories} brands={brands} search={search} selectedCategory={selectedCategory} selectedBrand={selectedBrand} minPrice={minPrice} maxPrice={maxPrice} onSearchChange={setSearch} onCategoryChange={setSelectedCategory} onBrandChange={setSelectedBrand} onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice} />
        </aside>

        <section aria-label="Products" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#788497]">Showing {isLoading ? '…' : visibleProducts.length} products</p><div className="flex items-center gap-2"><div className="flex rounded-lg border border-[#e5e9ee] bg-white p-1"><button type="button" aria-label="Grid view" onClick={() => setLayout('grid')} className={`rounded p-2 ${layout === 'grid' ? 'bg-[#12a857] text-white' : 'text-slate-500 hover:text-[#079b48]'}`}><Grid2X2 size={18} /></button><button type="button" aria-label="List view" onClick={() => setLayout('list')} className={`rounded p-2 ${layout === 'list' ? 'bg-[#12a857] text-white' : 'text-slate-500 hover:text-[#079b48]'}`}><List size={18} /></button></div><label className="sr-only" htmlFor="product-sort">Sort products</label><select id="product-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-11 rounded-lg border border-[#e5e9ee] bg-white px-3 text-sm outline-none focus:border-[#12a857]"><option value="featured">Relevance</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Rating: High to Low</option><option value="name">Name: A to Z</option><option value="name-z">Name: Z to A</option></select></div></div>
          {(search || selectedCategory || selectedBrand || selectedSubcategory || minPrice || maxPrice) && <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500"><span>Active:</span>{search && <button type="button" onClick={() => setSearch('')} className="rounded-full bg-slate-100 px-3 py-1 transition hover:bg-slate-200">“{search}” <span aria-hidden="true">×</span></button>}{selectedCategory && <button type="button" onClick={() => setSelectedCategory('')} className="rounded-full bg-slate-100 px-3 py-1 transition hover:bg-slate-200">{categories.find((category) => category._id === selectedCategory || category.slug === selectedCategory)?.name ?? 'Category'} ×</button>}{selectedBrand && <button type="button" onClick={() => setSelectedBrand('')} className="rounded-full bg-slate-100 px-3 py-1 transition hover:bg-slate-200">{brands.find((brand) => brand._id === selectedBrand || brand.slug === selectedBrand)?.name ?? 'Brand'} ×</button>}{selectedSubcategory && <button type="button" onClick={() => setSelectedSubcategory('')} className="rounded-full bg-slate-100 px-3 py-1 transition hover:bg-slate-200">Subcategory ×</button>}{(minPrice || maxPrice) && <button type="button" onClick={() => { setMinPrice(''); setMaxPrice('') }} className="rounded-full bg-slate-100 px-3 py-1 transition hover:bg-slate-200">Price ×</button>}<button type="button" onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedBrand(''); setSelectedSubcategory(''); setMinPrice(''); setMaxPrice('') }} className="ml-1 text-xs text-[#079b48] underline underline-offset-2 hover:text-[#056d33]">Clear all</button></div>}
          {loadError ? <p role="alert" className="rounded-xl border border-red-100 bg-white p-8 text-center text-red-600">{loadError}</p> : visibleProducts.length ? <div className={layout === 'grid' ? 'grid grid-cols-1 items-start gap-3 min-[480px]:grid-cols-2 sm:gap-4 2xl:grid-cols-3' : 'grid gap-4'}>{visibleProducts.map((product) => <div key={product._id} className="w-full min-w-0"><ProductCard product={product} layout={layout} /></div>)}</div> : <div className="rounded-xl border border-dashed border-[#dce5e0] bg-white py-16 text-center"><p className="font-semibold">No products found</p><p className="mt-1 text-sm text-slate-500">Try changing your filters or search.</p><button type="button" onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedBrand(''); setSelectedSubcategory(''); setMinPrice(''); setMaxPrice('') }} className="mt-4 rounded-lg bg-[#12a857] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d8f49]">Clear filters</button></div>}
        </section>
      </div>
    </main>
  )
}
