import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Filter, Layers3 } from 'lucide-react'
import { getCategories, getCategoryById as getCategory, getCategorySubcategoriesById as getCategorySubcategories } from '@/API/CategoryAPI/getspecificcategory'
import { getProducts, getSubcategories, getSubcategory } from '@/API/Shop/shopApi'
import type { Category } from '@/interfaces/category'
import type { Subcategory } from '@/interfaces/shop'
import ProductCard from '@/_components/Home/Products/ProductCard'

async function loadPageData<T>(request: () => Promise<T>) {
  try {
    return { data: await request(), error: '' }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Could not load data.' }
  }
}

export async function CategoriesPage() {
  const result = await loadPageData(getCategories)
  if (result.error || !result.data) return <ErrorMessage message={result.error} />
  const categories = result.data

  return (
    <main className="min-h-[60vh] bg-[#fbfcfd] pb-12">
      <header className="bg-gradient-to-r from-[#12a957] to-[#3ddc83] px-4 py-9 text-white sm:px-8"><div className="mx-auto max-w-[1280px]"><nav className="mb-4 flex gap-2 text-xs text-white/75"><Link href="/">Home</Link><span>/</span><span>Categories</span></nav><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-white/20"><Layers3 size={25} /></span><div><h1 className="text-3xl font-bold">All Categories</h1><p className="mt-1 text-sm text-white/85">Browse our wide range of product categories</p></div></div></div></header>
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:px-6">{categories.length ? categories.map((category) => <CategoryCard key={category._id} category={category} />) : <p className="col-span-full py-12 text-center text-sm text-slate-500">No categories found.</p>}</div>
    </main>
  )
}

export async function CategoryDetailPage({ id }: { id: string }) {
  const result = await loadPageData(() => Promise.all([getCategory(id), getProducts()]))
  if (result.error || !result.data) return <ErrorMessage message={result.error} />
  const [category, allProducts] = result.data
  const products = allProducts.filter((product) => product.category?._id === id)

  return (
    <main className="min-h-[60vh] bg-[#fbfcfd] pb-12 text-[#172338]">
      <header className="bg-gradient-to-r from-[#12a957] to-[#3ddc83] px-4 py-9 text-white sm:px-8 lg:py-12">
        <div className="mx-auto max-w-[1800px]">
          <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm text-white/80">
            <Link href="/" className="transition-colors hover:text-white">Home</Link><span>/</span>
            <Link href="/categories" className="transition-colors hover:text-white">Categories</Link><span>/</span>
            <span aria-current="page" className="font-semibold text-white">{category.name}</span>
          </nav>
          <div className="flex items-center gap-5">
            <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/20 bg-white/20 shadow-lg sm:size-[84px]">
              <Image src={category.image} alt={category.name} fill sizes="84px" className="object-contain p-3" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
              <p className="mt-1 text-base text-white/90 sm:text-lg">Browse products in {category.name}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1800px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-7 flex flex-wrap items-center gap-3 text-base sm:gap-4">
          <span className="inline-flex items-center gap-2 text-slate-600"><Filter size={19} /> Active Filters:</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#dcfce7] px-4 py-2 font-medium text-[#168548]"><Layers3 size={17} />{category.name}<span aria-hidden="true" className="text-lg leading-none">×</span></span>
          <Link href="/products" className="text-slate-600 underline underline-offset-2 transition-colors hover:text-emerald-700">Clear all</Link>
        </div>
        <p className="mb-6 text-base text-slate-500">Showing {products.length} {products.length === 1 ? 'product' : 'products'}</p>
        {products.length ? (
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((product) => <div key={product._id} className="w-full"><ProductCard product={product} /></div>)}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-slate-100 text-slate-400"><Layers3 size={28} /></div>
            <h2 className="text-xl font-semibold text-[#172338]">No products found</h2>
            <p className="mt-2 text-base text-slate-500">There are no products in {category.name} yet.</p>
            <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#16a34a] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#15803d]">Browse all products <ArrowRight size={18} /></Link>
          </div>
        )}
      </section>
    </main>
  )
}

export async function CategorySubcategoriesPage({ id }: { id: string }) {
  const result = await loadPageData(() => Promise.all([getCategory(id), getCategorySubcategories(id)]))
  if (result.error || !result.data) return <ErrorMessage message={result.error} />
  const [category, subcategories] = result.data

  return <main className="min-h-[60vh] bg-[#fbfcfd] px-4 py-7 sm:px-6"><div className="mx-auto max-w-[1280px]"><Breadcrumb name={category.name} /><h1 className="mb-6 text-2xl font-bold text-[#172338]">{category.name} Subcategories</h1><SubcategoryGrid items={subcategories} /></div></main>
}

export async function SubcategoriesPage() {
  const result = await loadPageData(getSubcategories)
  if (result.error || !result.data) return <ErrorMessage message={result.error} />
  return <main className="min-h-[60vh] bg-[#fbfcfd] px-4 py-7 sm:px-6"><div className="mx-auto max-w-[1280px]"><Breadcrumb name="Subcategories" /><h1 className="mb-6 text-2xl font-bold text-[#172338]">All Subcategories</h1><SubcategoryGrid items={result.data} /></div></main>
}

export async function SubcategoryDetailPage({ id }: { id: string }) {
  const result = await loadPageData(() => Promise.all([getSubcategory(id), getProducts()]))
  if (result.error || !result.data) return <ErrorMessage message={result.error} />
  const [subcategory, allProducts] = result.data
  const products = allProducts.filter((product) => product.subcategory?.some((item) => item._id === id))

  return <main className="min-h-[60vh] bg-[#fbfcfd] px-4 py-7 sm:px-6"><div className="mx-auto max-w-[1280px]"><Breadcrumb name={subcategory.name} /><h1 className="mb-2 text-2xl font-bold text-[#172338]">{subcategory.name}</h1><p className="mb-6 text-sm text-slate-500">Explore products in this subcategory.</p>{products.length ? <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{products.map((product) => <div key={product._id} className="w-full max-w-[275px]"><ProductCard product={product} /></div>)}</div> : <p className="rounded-xl bg-white py-10 text-center text-sm text-slate-500">No products in this subcategory yet.</p>}</div></main>
}

function CategoryCard({ category }: { category: Category }) {
  return <Link href={`/categories/${category._id}`} className="group rounded-xl border border-[#edf0f2] bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"><span className="relative block aspect-square overflow-hidden rounded-lg bg-[#f5f7f7]"><Image src={category.image} alt={category.name} fill sizes="(max-width:639px) 45vw, (max-width:1023px) 30vw, 20vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /></span><strong className="mt-3 block text-sm text-[#263247] group-hover:text-emerald-600">{category.name}</strong><span className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-600">View Subcategories <ArrowRight size={12} /></span></Link>
}

function SubcategoryGrid({ items }: { items: Subcategory[] }) {
  if (!items.length) return <p className="rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-500">No subcategories available.</p>
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{items.map((subcategory) => { const categoryId = typeof subcategory.category === 'string' ? subcategory.category : subcategory.category?._id; return <article key={subcategory._id} className="rounded-xl border border-[#edf0f2] bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50"><Link href={`/subcategories/${subcategory._id}`} className="block text-sm font-semibold text-[#344054] hover:text-emerald-700">{subcategory.name}<span className="mt-2 block text-xs font-normal text-slate-400">View products →</span></Link>{categoryId && <Link href={`/categories/${categoryId}`} className="mt-2 inline-block text-[10px] text-slate-400 hover:text-emerald-600">View parent category</Link>}</article> })}</div>
}

function Breadcrumb({ name }: { name: string }) { return <nav className="mb-5 flex gap-2 text-xs text-slate-400"><Link href="/" className="hover:text-emerald-600">Home</Link><span>/</span><Link href="/categories" className="hover:text-emerald-600">Categories</Link><span>/</span><span className="text-slate-700">{name}</span></nav> }
function ErrorMessage({ message }: { message: string }) { return <main className="mx-auto min-h-[50vh] max-w-[1280px] px-4 py-16"><p role="alert" className="rounded-xl border border-red-100 bg-white p-8 text-center text-red-600">{message}</p></main> }
