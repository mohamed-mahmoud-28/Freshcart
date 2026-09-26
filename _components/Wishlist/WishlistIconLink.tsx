"use client"

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from './useWishlist'

export default function WishlistIconLink({ className = '' }: { className?: string }) {
  const { data: products } = useWishlist()
  const itemCount = products?.length ?? 0

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist${itemCount ? `, ${itemCount} saved ${itemCount === 1 ? 'item' : 'items'}` : ''}`}
      className={`relative flex h-12 w-12 items-center justify-center rounded-full text-[#64748B] transition-all duration-200 hover:scale-105 hover:bg-[#F0FDF4] hover:text-[#16A34A] active:scale-95 ${className}`}
    >
      <Heart size={25} strokeWidth={1.8} />
      {itemCount > 0 && <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-[#ef3448] px-1 text-[10px] font-bold leading-none text-white shadow-sm" aria-hidden="true">{itemCount > 99 ? '99+' : itemCount}</span>}
    </Link>
  )
}
