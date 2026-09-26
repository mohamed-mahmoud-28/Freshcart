"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import AddToCartButton from '@/_components/Cart/AddToCartButton'
import { useWishlist } from './useWishlist'
import { toast } from '@/components/ui/toast'

const price = (value: number) => value.toLocaleString('en-EG')

export default function WishlistPage() {
  const { status } = useSession()
  const { data: products = [], isLoading, isError, error, toggleWishlist, isUpdatingWishlist } = useWishlist()

  if (status === 'loading' || isLoading) {
    return <main className="mx-auto min-h-[55vh] w-full max-w-[1280px] px-4 py-12"><div className="h-12 animate-pulse rounded-lg bg-slate-100" /><div className="mt-6 grid gap-3">{[1, 2, 3].map((row) => <div key={row} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}</div></main>
  }

  if (status !== 'authenticated') {
    return <main className="grid min-h-[55vh] place-items-center px-4 py-12"><section className="text-center"><span className="mx-auto grid size-20 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Heart size={34} /></span><h1 className="mt-6 text-2xl font-bold text-slate-900">Sign in to view your wishlist</h1><p className="mt-2 text-slate-500">Your saved favorites will be here when you sign in.</p><Link href="/login?callbackUrl=/wishlist" className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-[#12a857] px-8 font-semibold text-white transition hover:bg-[#0d8f49]">Sign In</Link></section></main>
  }

  if (isError) {
    return <main className="mx-auto min-h-[55vh] max-w-[1280px] px-4 py-12"><p className="rounded-xl border border-red-100 bg-white p-8 text-center text-red-600" role="alert">{error instanceof Error ? error.message : 'Could not load your wishlist.'}</p></main>
  }

  if (products.length === 0) {
    return (
      <main className="grid min-h-[min(620px,calc(100vh-120px))] place-items-center bg-[#fbfcfd] px-4 py-10">
        <section className="flex w-full flex-col items-center text-center">
          <span className="grid size-24 place-items-center rounded-[20px] bg-[#f1f3f5] text-[#9aa4b2]"><Heart size={38} strokeWidth={2} /></span>
          <h1 className="mt-7 text-[25px] font-bold text-[#172338]">Your wishlist is empty</h1>
          <p className="mt-3 text-base text-[#657184]">Browse products and save your favorites here.</p>
          <Link href="/products" className="mt-8 inline-flex min-h-[58px] w-full max-w-[480px] items-center justify-center gap-3 rounded-[14px] bg-[#12a857] px-8 text-lg font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0d8f49]">Browse Products <ArrowRight size={21} /></Link>
        </section>
      </main>
    )
  }

  async function removeProduct(productId: string) {
    try {
      await toggleWishlist({ productId, method: 'DELETE' })
    } catch (removeError) {
      toast.add({ type: 'error', description: removeError instanceof Error ? removeError.message : 'Could not remove this product.' })
    }
  }

  return (
    <main className="min-h-[calc(100vh-120px)] bg-white px-4 py-6 text-[#172338] sm:px-6 lg:py-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <nav className="mb-4 flex items-center gap-2 text-xs text-[#8994a5]" aria-label="Breadcrumb"><Link href="/" className="transition hover:text-[#079b48]">Home</Link><span>/</span><span className="text-[#344054]">Wishlist</span></nav>
        <header className="mb-6 flex items-center gap-3 border-b border-[#edf0f2] pb-5">
          <span className="grid size-11 place-items-center rounded-xl bg-[#fff1f2] text-[#ff3346]"><Heart size={21} fill="currentColor" /></span>
          <div><h1 className="text-[22px] font-bold leading-tight">My Wishlist</h1><p className="mt-0.5 text-xs text-[#778397]">{products.length} {products.length === 1 ? 'item' : 'items'} saved</p></div>
        </header>

        <div className="overflow-hidden rounded-xl border border-[#edf0f2]">
          <div className="hidden grid-cols-[minmax(0,1fr)_130px_130px_190px] items-center bg-[#f8f9fa] px-5 py-3 text-xs text-[#788497] md:grid"><span>Product</span><span>Price</span><span>Status</span><span className="text-right">Actions</span></div>
          {products.map((product) => {
            const currentPrice = product.priceAfterDiscount ?? product.price
            return (
              <article key={product._id} className="grid gap-3 border-t border-[#edf0f2] p-4 first:border-t-0 md:grid-cols-[minmax(0,1fr)_130px_130px_190px] md:items-center md:px-5">
                <Link href={`/products/${product._id}`} className="flex min-w-0 items-center gap-3 group">
                  <span className="relative grid size-[66px] shrink-0 place-items-center overflow-hidden rounded-xl border border-[#edf0f2] bg-[#f8f9fa]"><Image src={product.imageCover} alt={product.title} fill sizes="66px" className="object-contain p-1 transition-transform group-hover:scale-105" /></span>
                  <span className="min-w-0"><strong className="line-clamp-2 text-sm font-medium text-[#1d2939] transition group-hover:text-[#079b48]">{product.title}</strong><small className="mt-1 block text-xs text-[#8994a5]">{product.category.name}</small></span>
                </Link>
                <div className="flex items-baseline gap-2 text-sm font-semibold text-[#172338] md:block"> <span className="mr-1 text-xs font-normal text-slate-500 md:hidden">Price:</span>{price(currentPrice)} EGP{product.priceAfterDiscount && <del className="ml-2 text-xs font-normal text-slate-400">{price(product.price)} EGP</del>}</div>
                <div className="text-xs text-[#079b48]"><span className="mr-1 text-slate-500 md:hidden">Status:</span><span className="rounded-full bg-[#effbf3] px-2.5 py-1">● {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</span></div>
                <div className="flex items-center gap-2 md:justify-end">
                  <AddToCartButton productId={product._id} showAddedState className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#12a857] px-3 text-sm font-medium text-white transition hover:bg-[#0d8f49] md:flex-none"><ShoppingCart size={16} /> Add to Cart</AddToCartButton>
                  <button type="button" aria-label={`Remove ${product.title} from wishlist`} disabled={isUpdatingWishlist} onClick={() => void removeProduct(product._id)} className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#e7ebef] text-[#98a2b3] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"><Trash2 size={16} /></button>
                </div>
              </article>
            )
          })}
        </div>
        <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-xs text-[#788497] transition hover:text-[#078c43]">← Continue Shopping</Link>
      </div>
    </main>
  )
}
