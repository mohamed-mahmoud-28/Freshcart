import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Tag } from 'lucide-react'
import { getBrand, getBrands, getProducts } from '@/API/Shop/shopApi'
import ProductCard from '@/_components/Home/Products/ProductCard'

async function loadPageData<T>(request: () => Promise<T>) {
  try {
    return { data: await request(), error: '' }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Could not load data.' }
  }
}

export async function BrandsPage() {
  const result = await loadPageData(getBrands)
  if (result.error || !result.data) return <ErrorPage message={result.error} />
  const brands = result.data

  return (
    <main className="min-h-[60vh] bg-[#fbfcfd] pb-12">
      <header className="bg-gradient-to-r from-[#873bfa] to-[#bb69ff] px-4 py-9 text-white sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <nav className="mb-4 flex gap-2 text-xs text-white/75"><Link href="/">Home</Link><span>/</span><span>Brands</span></nav>
          <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-white/20"><Tag size={25} /></span><div><h1 className="text-3xl font-bold">Top Brands</h1><p className="mt-1 text-sm text-white/85">Shop from your favorite brands</p></div></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 px-4 py-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:px-6">
        {brands.length ? brands.map((brand) => <Link key={brand._id} href={`/brands/${brand._id}`} className="group rounded-xl border border-[#edf0f2] bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#d9c3ff] hover:shadow-md"><span className="relative grid aspect-square place-items-center overflow-hidden rounded-lg bg-[#f8f9fa] p-4"><Image src={brand.image} alt={brand.name} fill sizes="(max-width:639px) 45vw, (max-width:1023px) 30vw, 16vw" className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" /></span><span className="mt-3 block text-sm font-semibold text-[#263247] transition group-hover:text-violet-600">{brand.name}</span></Link>) : <p className="col-span-full py-12 text-center text-sm text-slate-500">No brands found.</p>}
      </div>
    </main>
  )
}

export async function BrandDetailPage({ id }: { id: string }) {
  const result = await loadPageData(() => Promise.all([getBrand(id), getProducts()]))
  if (result.error || !result.data) return <ErrorPage message={result.error} />
  const [brand, allProducts] = result.data
  const products = allProducts.filter((product) => product.brand?._id === id)

  return (
    <main className="min-h-[60vh] bg-[#fbfcfd] px-4 py-7 text-[#172338] sm:px-6">
      <div className="mx-auto max-w-[1280px]">
        <nav className="mb-5 flex gap-2 text-xs text-slate-400"><Link href="/">Home</Link><span>/</span><Link href="/brands">Brands</Link><span>/</span><span className="text-slate-700">{brand.name}</span></nav>
        <header className="mb-7 flex items-center gap-4 rounded-xl border border-[#edf0f2] bg-white p-5"><span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50"><Image src={brand.image} alt={brand.name} fill sizes="80px" className="object-contain p-2" /></span><div><h1 className="text-2xl font-bold">{brand.name}</h1><p className="mt-1 text-sm text-slate-500">Products by {brand.name}</p></div></header>
        {products.length ? <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{products.map((product) => <div key={product._id} className="w-full max-w-[275px]"><ProductCard product={product} /></div>)}</div> : <EmptyProducts />}
      </div>
    </main>
  )
}

function ErrorPage({ message }: { message: string }) {
  return <main className="mx-auto min-h-[50vh] max-w-[1280px] px-4 py-16"><p role="alert" className="rounded-xl border border-red-100 bg-white p-8 text-center text-red-600">{message}</p></main>
}

function EmptyProducts() {
  return <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center"><p className="font-semibold">No products found for this brand.</p><Link href="/products" className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600">Browse all products <ArrowRight size={16} /></Link></div>
}
