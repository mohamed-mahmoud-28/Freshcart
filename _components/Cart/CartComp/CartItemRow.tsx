'use client'

import Image from 'next/image'
import { Check, Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/interfaces/cart'

const formatPrice = (price: number) => new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 }).format(price)

type CartItemRowProps = {
  item: CartItem
  onQuantityChange: (productId: string, count: number) => void
  onDelete: (item: CartItem) => void
  isUpdating: boolean
}

export default function CartItemRow({ item, onQuantityChange, onDelete, isUpdating }: CartItemRowProps) {
  const { count, price, product } = item

  return (
    <article className="flex min-w-0 gap-2 rounded-xl border border-[#e9edf1] bg-white p-3 shadow-sm md:gap-5 md:rounded-[13px] md:p-5">
      <div className="flex w-[70px] shrink-0 flex-col items-center gap-2 md:w-[120px] md:gap-2.5">
        <Image src={product.imageCover} alt={product.title} width={180} height={180} className="size-[68px] rounded-lg border border-[#eef0f2] object-contain p-1.5 md:size-[106px] md:rounded-[10px]" />
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#0aad55] px-2 py-1 text-[9px] text-white"><Check size={12} /> In Stock</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex min-h-[84px] items-start justify-between gap-2 md:min-h-[100px] md:gap-4">
          <div className="min-w-0">
            <h2 className="mb-2 truncate text-xs font-semibold text-[#172338] md:text-[17px]">{product.title}</h2>
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-[#8a95a7] md:gap-2 md:text-[10px]">
              {product.category?.name && <span className="rounded-full bg-[#effaf3] px-2 py-1 text-[#078c43]">{product.category.name}</span>}
              <span className="hidden sm:inline">SKU: {product._id.slice(-6).toUpperCase()}</span>
            </div>
            <p className="mt-2 flex items-baseline gap-2"><strong className="text-sm font-bold text-[#079b48] md:text-base">{formatPrice(price)} EGP</strong><span className="text-[9px] text-[#9aa4b2]">per unit</span></p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5 self-end">
            <span className="text-[9px] text-[#9aa4b2]">Total</span>
            <strong className="text-sm md:text-lg">{formatPrice(price * count)}<small className="text-[9px] font-normal text-[#8994a5]"> EGP</small></strong>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-[#e4e9ee]" aria-label={`Quantity: ${count}`}>
            <button className="grid size-9 place-items-center bg-[#f9fafb] text-[#64748b] transition hover:bg-[#effbf5] hover:text-[#078c43] disabled:cursor-not-allowed disabled:opacity-40" type="button" aria-label="Decrease quantity" disabled={count <= 1 || isUpdating} onClick={() => onQuantityChange(product._id, count - 1)}><Minus size={17} /></button>
            <span className="grid h-9 min-w-11 place-items-center border-x border-[#e4e9ee] text-sm font-semibold" aria-live="polite">{count}</span>
            <button className="grid size-9 place-items-center bg-[#119d4b] text-white transition hover:bg-[#0b843e] disabled:cursor-not-allowed disabled:opacity-40" type="button" aria-label="Increase quantity" disabled={isUpdating} onClick={() => onQuantityChange(product._id, count + 1)}><Plus size={17} /></button>
          </div>
          <button className="grid size-9 place-items-center rounded-lg border border-[#ffdbdd] bg-[#fff7f7] text-[#ef4444] transition hover:bg-[#fff0f0] disabled:cursor-not-allowed disabled:opacity-50" type="button" aria-label={`Remove ${product.title}`} disabled={isUpdating} onClick={() => onDelete(item)}><Trash2 size={18} /></button>
        </div>
      </div>
    </article>
  )
}
