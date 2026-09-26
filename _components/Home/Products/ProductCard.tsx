"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, RefreshCw, Star } from "lucide-react"
import type { Products as Product } from "@/interfaces/products"
import AddToCartButton from "@/_components/Cart/AddToCartButton"
import WishlistButton from "@/_components/Wishlist/WishlistButton"

type ProductCardProps = {
    product: Product
    layout?: "grid" | "list"
}

export default function ProductCard({ product, layout = "grid" }: ProductCardProps) {
    const hasDiscount = Boolean(product.priceAfterDiscount && product.priceAfterDiscount < product.price)
    const discount = hasDiscount ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100) : 0
    const rating = Math.max(0, Math.min(5, product.ratingsAverage || 0))
    const isList = layout === "list"

    return (
        <article className={`group relative flex w-full min-w-0 overflow-hidden rounded-xl border border-[#e5e9ee] bg-white transition duration-300 hover:border-[#8fd3b2] hover:shadow-[0_16px_35px_rgba(21,61,46,0.14)] ${isList ? "min-h-[380px] flex-col sm:min-h-[420px] sm:flex-row" : "min-h-[380px] flex-col sm:min-h-[420px] lg:h-[465px] lg:min-h-0"}`}>
            <Link href={`/products/${product._id}`} aria-label={`Open ${product.title}`} className="absolute inset-0 z-0" />

            <div className={`relative shrink-0 overflow-hidden bg-[#f8faf9] ${isList ? "h-[230px] w-full sm:h-auto sm:min-h-[420px] sm:w-[40%]" : "h-[160px] w-full min-[420px]:h-[185px] sm:h-[220px] lg:h-[260px]"}`}>
                {hasDiscount && <span className="absolute left-3 top-3 z-10 rounded-lg bg-[#ff3346] px-2.5 py-1 text-xs font-bold text-white">-{discount}%</span>}
                <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes={isList ? "(max-width: 639px) 100vw, 34vw" : "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"}
                    className={`object-contain transition duration-500 group-hover:scale-105 ${isList ? "p-1" : "p-3"}`}
                />

                <div className="pointer-events-none absolute right-2 top-2 z-10 flex flex-col gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
                    <WishlistButton productId={product._id} productTitle={product.title} className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-[#edf0f2] bg-white/95 text-[#64748b] shadow-sm transition hover:border-[#fecdd3] hover:bg-[#fff1f2] hover:text-[#ef233c] sm:size-10" />
                    <button type="button" aria-label={`Compare ${product.title}`} title="Compare products" className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-[#edf0f2] bg-white/95 text-[#64748b] shadow-sm transition hover:border-[#b9dfcd] hover:bg-[#f0fdf6] hover:text-[#0b9f5a] sm:size-10"><RefreshCw size={16} strokeWidth={2} className="sm:size-[18px]" /></button>
                    <Link href={`/products/${product._id}`} aria-label={`View ${product.title}`} className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-[#edf0f2] bg-white/95 text-[#64748b] shadow-sm transition hover:border-[#b9dfcd] hover:bg-[#f0fdf6] hover:text-[#0b9f5a] sm:size-10"><Eye size={16} strokeWidth={2} className="sm:size-[19px]" /></Link>
                </div>
            </div>

            <div className={`pointer-events-none relative z-10 flex min-w-0 flex-1 flex-col ${isList ? "justify-center p-4 sm:p-6 lg:p-8" : "px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3 lg:px-4 lg:pb-4"}`}>
                <p className="mb-1 truncate text-[10px] font-medium text-[#64748b] sm:text-xs">{product.category.name}</p>
                <h3 className={`line-clamp-2 font-semibold leading-snug text-[#213047] ${isList ? "text-base sm:text-lg lg:text-xl" : "min-h-8 text-[13px] sm:min-h-9 sm:text-sm lg:text-base"}`}><span className="transition group-hover:text-[#079b5b]">{product.title}</span></h3>

                <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 sm:mt-2.5 sm:gap-x-2">
                    <div className="flex items-center text-[#ffc107]" aria-label={`${rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={13} className="sm:size-4" strokeWidth={1.6} fill={index < Math.round(rating) ? "currentColor" : "none"} />)}
                    </div>
                    <span className="text-[10px] text-[#64748b] sm:text-[11px]">{rating.toFixed(1)} ({product.ratingsQuantity})</span>
                </div>

                {isList && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#788497]">{product.description}</p>}

                <div className={`pointer-events-none flex flex-wrap items-end justify-between gap-2 pt-3 sm:gap-2.5 sm:pt-4 ${isList ? "mt-2" : "mt-auto"}`}>
                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1">
                        <span className="whitespace-nowrap text-sm font-bold text-[#213047] sm:text-lg lg:text-xl">{(product.priceAfterDiscount ?? product.price).toLocaleString("en-EG")} EGP</span>
                        {hasDiscount && <del className="text-[10px] text-[#94a3b8] sm:text-xs lg:text-sm">{product.price.toLocaleString("en-EG")} EGP</del>}
                    </div>

                    <AddToCartButton productId={product._id} showAddedState resetAfterAddMs={1500} className="pointer-events-auto relative z-20 inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[#12a857] p-0 text-white shadow-[0_5px_12px_rgba(18,168,87,0.2)] transition hover:scale-105 hover:bg-[#078c48] active:scale-95">
                        <span className="sr-only">Add {product.title} to cart</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="h-6 w-6"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                    </AddToCartButton>
                </div>
            </div>
        </article>
    )
}
