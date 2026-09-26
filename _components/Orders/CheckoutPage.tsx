'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Check, CreditCard, LockKeyhole, MapPin, ShoppingBag, Truck } from 'lucide-react'
import { useCart } from '@/_components/Cart/useCart'

const field = 'mt-1.5 h-11 w-full rounded-lg border border-[#e3e8ed] bg-white px-3 text-sm text-[#263247] outline-none transition focus:border-[#12a857] focus:ring-2 focus:ring-[#12a857]/10'

export default function CheckoutPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useCart()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [payment, setPayment] = useState<'cash' | 'online'>('cash')
  const products = data?.data?.products ?? []
  const total = data?.data?.totalCartPriceAfterDiscount ?? data?.data?.totalCartPrice ?? 0

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cartId: data?.data?._id ?? data?.cartId ?? data?.data?.cartId, payment, shippingAddress: { details: String(form.get('details') || ''), phone: String(form.get('phone') || ''), city: String(form.get('city') || '') }, url: window.location.origin }) })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Could not create checkout session.')
      const checkout = result?.session?.url ?? result?.url
      if (payment === 'online') {
        if (!checkout) throw new Error('Payment provider did not return a checkout link.')
        window.location.assign(checkout); return
      }
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      router.push('/orders')
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Checkout failed. Please try again.') }
    finally { setBusy(false) }
  }

  if (isLoading) return <main className="mx-auto min-h-[55vh] max-w-6xl animate-pulse p-8"><div className="h-8 w-48 rounded bg-slate-100" /><div className="mt-8 h-80 rounded-xl bg-slate-100" /></main>
  if (error || products.length === 0) return <main className="mx-auto min-h-[55vh] max-w-6xl px-4 py-12"><section className="rounded-xl border border-slate-200 bg-white p-10 text-center"><ShoppingBag className="mx-auto text-emerald-600"/><h1 className="mt-4 text-xl font-bold">Your cart is empty</h1><p className="mt-2 text-sm text-slate-500">Add products to your cart before checkout.</p><Link className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white" href="/products">Browse products</Link></section></main>

  return <main className="min-h-[calc(100vh-68px)] bg-[#f7f8fa] px-4 py-8 text-[#172338] md:px-8"><div className="mx-auto max-w-6xl"><nav className="mb-3 flex items-center gap-2 text-xs text-slate-400"><Link href="/">Home</Link><span>/</span><Link href="/cart">Cart</Link><span>/</span><span className="text-slate-700">Checkout</span></nav><header className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-emerald-600 text-white"><ShoppingBag /></span><div><h1 className="text-2xl font-bold">Complete Your Order</h1><p className="text-xs text-slate-500">Review your items and complete your purchase</p></div></div><Link href="/cart" className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><ArrowLeft size={14}/> Back to Cart</Link></header>
    <form onSubmit={submit} className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="grid gap-5"><section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><h2 className="flex items-center gap-2 bg-[#118842] px-4 py-3 text-sm font-semibold text-white"><MapPin size={16}/> Shipping Address</h2><div className="grid gap-4 p-5 sm:grid-cols-2"><label className="text-xs font-medium text-slate-600 sm:col-span-2">Street address *<input className={field} name="details" placeholder="Street name, building number, floor..." required /></label><label className="text-xs font-medium text-slate-600">City *<input className={field} name="city" placeholder="Cairo" required /></label><label className="text-xs font-medium text-slate-600">Phone number *<input className={field} name="phone" type="tel" placeholder="01xxxxxxxxx" required /></label><p className="sm:col-span-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700"><Truck className="mr-2 inline" size={15}/>Delivery information: orders are shipped to this address.</p></div></section>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><h2 className="flex items-center gap-2 bg-[#118842] px-4 py-3 text-sm font-semibold text-white"><CreditCard size={16}/> Payment Method</h2><div className="grid gap-3 p-5"><label className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${payment === 'cash' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'}`}><span><strong className="block text-sm">Cash on Delivery</strong><small className="text-xs text-slate-500">Pay when your order arrives</small></span><input type="radio" checked={payment === 'cash'} onChange={() => setPayment('cash')} className="accent-emerald-600"/></label><label className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 ${payment === 'online' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'}`}><span><strong className="block text-sm">Pay Online</strong><small className="text-xs text-slate-500">Secure payment with card via Stripe</small></span><input type="radio" checked={payment === 'online'} onChange={() => setPayment('online')} className="accent-emerald-600"/></label><p className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500"><LockKeyhole className="mr-2 inline text-emerald-600" size={14}/>Your payment details are protected.</p></div></section></div>
    <aside className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:sticky lg:top-28"><h2 className="bg-[#118842] px-4 py-3 text-sm font-semibold text-white">Order Summary <span className="float-right text-xs font-normal">{products.length} items</span></h2><div className="p-4">{products.map(item => <div key={item.product._id} className="flex items-center justify-between border-b border-slate-100 py-3 text-xs"><span className="min-w-0 pr-3"><span className="block truncate font-medium">{item.product.title}</span><span className="mt-1 block text-slate-400">{item.count} × {item.price} EGP</span></span><strong>{item.price * item.count} EGP</strong></div>)}<div className="flex justify-between py-3 text-xs text-slate-500"><span>Shipping</span><span className="text-emerald-600">FREE</span></div><div className="flex justify-between border-t border-dashed py-3 font-bold"><span>Total</span><span className="text-emerald-700">{total.toLocaleString()} EGP</span></div>{message && <p role="alert" className="mb-3 rounded bg-red-50 p-2 text-xs text-red-600">{message}</p>}<button disabled={busy} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{busy ? 'Processing…' : <><Check size={16}/> Place Order</>}</button><p className="mt-3 text-center text-[10px] text-slate-400">Secure · Fast Delivery · Easy Returns</p></div></aside></form></div></main>
}
