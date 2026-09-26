'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LockKeyhole, ShieldCheck, ShoppingCart, Tag, Truck } from 'lucide-react'

const formatPrice = (price: number) => new Intl.NumberFormat('en-EG', { maximumFractionDigits: 0 }).format(price)

interface OrderSummaryProps {
  itemCount: number
  total: number
  discountedTotal?: number
  applyCoupon: (coupon: string) => Promise<unknown>
  isApplyingCoupon: boolean
}

export default function OrderSummary({ itemCount, total, discountedTotal, applyCoupon, isApplyingCoupon }: OrderSummaryProps) {
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [promoError, setPromoError] = useState(false)

  return (
    <aside className="overflow-hidden rounded-[13px] border border-[#e9edf1] bg-white shadow-sm lg:sticky lg:top-[106px]">
      <div className="bg-gradient-to-r from-[#119c4a] to-[#137d3b] px-5 py-4 text-white">
        <h2 className="flex items-center gap-2.5 text-[17px] font-semibold"><ShoppingCart size={19} /> Order Summary</h2>
        <p className="mt-1.5 text-xs text-[#e2f5e9]">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
      </div>
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3 rounded-[10px] bg-gradient-to-r from-[#effaf3] to-[#f5f6f8] p-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e0f8e9] text-[#08a34c]"><Truck size={20} /></span>
          <div><strong className="text-[13px] font-semibold text-[#068d40]">Free Shipping!</strong><p className="mt-1 text-[11px] text-[#4c9c69]">You qualify for free delivery</p></div>
        </div>
        <dl className="m-0">
          <div className="flex justify-between py-2.5 text-[13px] text-[#596579]"><dt>Subtotal</dt><dd className="m-0 text-[#172338]">{formatPrice(total)} EGP</dd></div>
          <div className="flex justify-between py-2.5 text-[13px] text-[#596579]"><dt>Shipping</dt><dd className="m-0 text-[#079b48]">FREE</dd></div>
          {discountedTotal !== undefined && discountedTotal < total && <div className="flex justify-between py-2.5 text-[13px] text-[#079b48]"><dt>Discount</dt><dd className="m-0">−{formatPrice(total - discountedTotal)} EGP</dd></div>}
          <div className="mt-1 flex justify-between border-t border-dashed border-[#e5e9ed] pt-3 text-[13px] font-semibold text-[#263247]"><dt>Total</dt><dd className="m-0 text-[22px] font-bold text-[#172338]">{formatPrice(discountedTotal ?? total)} <small className="text-[9px] font-normal text-[#8d97a6]">EGP</small></dd></div>
        </dl>

        <button type="button" className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#d9dfe5] text-xs text-[#596579] transition hover:border-[#119c4a] hover:bg-[#f5fcf7] hover:text-[#078c43]" aria-expanded={promoOpen} onClick={() => { setPromoOpen((open) => !open); setPromoMessage('') }}>
          <Tag size={17} fill="currentColor" /> {promoOpen ? 'Hide Promo Code' : 'Apply Promo Code'}
        </button>
        {promoOpen && (
          <form className="mt-2 grid grid-cols-[1fr_auto] gap-2" onSubmit={async (event) => {
            event.preventDefault()
            setPromoMessage('')
            setPromoError(false)
            if (!promoCode.trim()) {
              setPromoMessage('Enter a promo code first.')
              setPromoError(true)
              return
            }

            try {
              const result = await applyCoupon(promoCode.trim()) as { message?: string }
              setPromoMessage(result.message ?? 'Promo code applied successfully.')
            } catch (error) {
              setPromoMessage(error instanceof Error ? error.message : 'Failed to apply promo code.')
              setPromoError(true)
            }
          }}>
            <label className="sr-only" htmlFor="cart-promo-code">Promo code</label>
            <input className="h-10 min-w-0 rounded-lg border border-[#d9dfe5] px-3 text-xs outline-none focus:border-[#119c4a] focus:ring-2 focus:ring-[#119c4a]/15" id="cart-promo-code" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Enter promo code" disabled={isApplyingCoupon} />
            <button className="cursor-pointer rounded-lg bg-[#119c4a] px-4 text-xs text-white transition hover:bg-[#0b843e] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isApplyingCoupon}>{isApplyingCoupon ? 'Applying…' : 'Apply'}</button>
            {promoMessage && <p className={`col-span-full m-0 text-[10px] ${promoError ? 'text-red-600' : 'text-[#078c43]'}`} role="status">{promoMessage}</p>}
          </form>
        )}
        <Link href="/checkout" className="mt-3 flex h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#12a34b] to-[#147e3e] text-sm font-semibold text-white shadow-md shadow-[#119746]/20 transition hover:-translate-y-0.5 hover:brightness-95">
          <LockKeyhole size={18} /> Secure Checkout
        </Link>

        <div className="my-4 flex items-center justify-center gap-3 text-[10px] text-[#8490a0]"><span className="flex items-center gap-1"><ShieldCheck size={15} className="text-[#0aa64f]" /> Secure Payment</span><i className="h-3 w-px bg-[#e8ebef]" /><span className="flex items-center gap-1"><Truck size={15} className="text-[#2781e3]" /> Fast Delivery</span></div>
        <Link className="flex items-center justify-center gap-1 text-xs text-[#079b48] transition hover:text-[#056d33]" href="/products"><ArrowLeft size={15} /> Continue Shopping</Link>
      </div>
    </aside>
  )
}
