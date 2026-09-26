'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight, PackageOpen, ShoppingCart, Trash2 } from 'lucide-react'
import type { CartItem } from '@/interfaces/cart'
import CartItemRow from './CartItemRow'
import CartLoading from './CartLoading'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'
import OrderSummary from './OrderSummary'
import { useCart } from '../useCart'

export default function CartComp() {
  const [deleteSelection, setDeleteSelection] = useState<CartItem | null | undefined>(undefined)
  const [deleteFailure, setDeleteFailure] = useState('')
  const { data, isLoading, isError, error, updateQuantity, removeCartItems, applyCoupon, isApplyingCoupon, isCartBusy, quantityError, isDeleting } = useCart()

  async function confirmDelete() {
    try {
      await removeCartItems({ productId: deleteSelection?.product._id })
      setDeleteSelection(undefined)
    } catch (error) {
      setDeleteFailure(error instanceof Error ? error.message : 'Failed to remove cart items')
    }
  }

  if (isLoading) return <CartLoading />

  if (isError) {
    return (
      <main className="min-h-[calc(100vh-68px)] bg-[#f7f8fa] px-4 py-8 text-[#172338] md:px-8 md:py-10">
        <div className="mx-auto w-full max-w-[1280px]">
          <p className="rounded-xl border border-[#e9edf1] bg-white p-8 text-center text-red-600" role="alert">
            {error instanceof Error ? error.message : 'Failed to load cart'}
          </p>
        </div>
      </main>
    )
  }

  const products = data?.data?.products ?? []
  const itemCount = products.reduce((sum, item) => sum + item.count, 0)
  const total = data?.data?.totalCartPrice ?? products.reduce((sum, item) => sum + item.price * item.count, 0)

  if (products.length === 0) {
    return (
      <main className="grid min-h-[min(620px,calc(100vh-68px))] place-items-center bg-white px-4 py-5 sm:px-6">
        <section className="flex w-full flex-col items-center px-5 py-7 text-center">
          <span className="mb-8 grid size-40 place-items-center rounded-full bg-[#f2f3f5] text-[#cbd0d8] max-sm:mb-7 max-sm:size-[132px]"><PackageOpen size={54} strokeWidth={2.5} /></span>
          <h1 className="text-[25px] font-bold text-[#111827] sm:text-[28px]">Your cart is empty</h1>
          <p className="mb-9 mt-4 text-base leading-relaxed text-[#657184] sm:text-xl">Looks like you haven&apos;t added anything to your cart yet.<br />Start exploring our products!</p>
          <Link className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-[15px] bg-[#119c4a] px-7 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#0b843e] sm:min-h-[66px] sm:px-10 sm:text-lg" href="/products">Start Shopping <ArrowRight size={20} /></Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f7f8fa] px-4 py-8 text-[#172338] md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-[1280px]">
        <nav className="mb-3 flex items-center gap-2 text-xs text-[#8a95a7] [&_a:hover]:text-[#078f43]" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={14} aria-hidden="true" /><span className="text-[#344054]">Shopping Cart</span>
        </nav>
        <header className="flex items-center gap-3">
          <div className="grid size-[50px] place-items-center rounded-[11px] bg-[#139c4b] text-white"><ShoppingCart size={26} aria-hidden="true" /></div>
          <h1 className="text-[29px] font-bold tracking-tight text-[#172338] sm:text-[34px]">Shopping Cart</h1>
        </header>
        <p className="mb-7 mt-2 text-[15px] text-[#778397]">You have <strong className="font-semibold text-[#099b4a]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</strong> in your cart</p>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-[30px]">
          <section aria-label="Cart items">
            <div className="grid gap-4">
              {products.map((item) => (
                <CartItemRow
                  key={item.product._id}
                  item={item}
                  onQuantityChange={(productId, count) => updateQuantity({ productId, count })}
                  onDelete={(item) => { setDeleteFailure(''); setDeleteSelection(item) }}
                  isUpdating={isCartBusy}
                />
              ))}
            </div>
            {quantityError && <p className="text-sm text-red-600" role="alert">{quantityError.message}</p>}
            <div className="mt-3 flex items-center justify-between border-t border-[#e9edf1] pt-3 text-xs [&_a:hover]:text-[#056d33]">
              <Link className="inline-flex items-center gap-1.5 text-[#079b48] transition" href="/products"><ArrowLeft size={17} /> Continue Shopping</Link>
              <button type="button" className="inline-flex cursor-pointer items-center gap-1.5 text-[#9aa4b2] transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50" disabled={isCartBusy} onClick={() => { setDeleteFailure(''); setDeleteSelection(null) }}><Trash2 size={16} /> Clear all items</button>
            </div>
          </section>
          <OrderSummary
            itemCount={itemCount}
            total={total}
            discountedTotal={data?.data?.totalCartPriceAfterDiscount}
            applyCoupon={applyCoupon}
            isApplyingCoupon={isApplyingCoupon}
          />
        </div>
        {deleteSelection !== undefined && (
          <ConfirmDeleteDialog
            itemTitle={deleteSelection?.product.title}
            errorMessage={deleteFailure}
            isDeleting={isDeleting}
            onCancel={() => { setDeleteFailure(''); setDeleteSelection(undefined) }}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </main>
  )
}
