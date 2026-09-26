'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CalendarDays, ChevronDown, MapPin, Package, ShoppingBag, Truck } from 'lucide-react'

type OrderItem = { _id?: string; count: number; price: number; product?: { _id?: string; title?: string; imageCover?: string } }
type Order = {
  _id: string
  id?: string
  createdAt?: string
  isDelivered?: boolean
  isPaid?: boolean
  paymentMethodType?: string
  totalOrderPrice?: number
  cartItems?: OrderItem[]
  shippingAddress?: { details?: string; city?: string; phone?: string }
}
type OrdersPayload = { data?: Order[]; message?: string }

async function getOrders(): Promise<Order[]> {
  const response = await fetch('/api/orders', { cache: 'no-store' })
  const payload = await response.json().catch(() => null) as OrdersPayload | null
  if (!response.ok) throw new Error(payload?.message || 'Could not load your orders.')
  return payload?.data ?? []
}

function formatPrice(price = 0) {
  return `${price.toLocaleString('en-EG')} EGP`
}

function orderStatus(order: Order) {
  if (order.isDelivered) return 'Delivered'
  if (order.isPaid) return 'On the way'
  return 'Processing'
}

function statusClass(status: string) {
  if (status === 'Delivered') return 'bg-emerald-50 text-emerald-700'
  if (status === 'On the way') return 'bg-sky-50 text-sky-700'
  return 'bg-amber-50 text-amber-700'
}

export default function OrdersPage() {
  const query = useQuery({ queryKey: ['orders'], queryFn: getOrders, retry: false })
  const orders = query.data ?? []

  return (
    <main className="min-h-[70vh] bg-[#f7f9f8] px-4 py-8 text-[#263247] sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#12a857] text-white shadow-sm"><Package size={25}/></span>
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#12a857]">Your account</p><h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">My Orders</h1><p className="mt-1 text-sm text-[#758094]">Track your purchases and order details.</p></div>
          </div>
          <Link href="/products" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dfe5e9] bg-white px-4 text-sm font-semibold text-[#118a46] transition hover:border-[#12a857] hover:bg-[#f1fbf4]">Continue Shopping<ArrowRight size={15}/></Link>
        </header>

        {query.isLoading ? (
          <div className="grid gap-4">{[1, 2, 3].map(item => <div key={item} className="h-44 animate-pulse rounded-2xl border border-[#e4e9ed] bg-white"/>)}</div>
        ) : query.isError ? (
          <section className="rounded-2xl border border-red-100 bg-white p-8 text-center"><p role="alert" className="text-sm text-red-700">{query.error instanceof Error ? query.error.message : 'Could not load your orders.'}</p><button type="button" onClick={() => void query.refetch()} className="mt-4 rounded-lg border border-[#dfe5e9] px-4 py-2 text-sm font-medium hover:bg-slate-50">Try again</button></section>
        ) : orders.length === 0 ? (
          <section className="rounded-2xl border border-[#e4e9ed] bg-white px-6 py-16 text-center shadow-sm"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9f8ef] text-[#12a857]"><ShoppingBag size={24}/></span><h2 className="mt-5 text-xl font-bold">No orders yet</h2><p className="mt-2 text-sm text-[#758094]">Your purchases will appear here once you place an order.</p><Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-lg bg-[#12a857] px-5 text-sm font-semibold text-white hover:bg-[#0d9149]">Explore Products</Link></section>
        ) : (
          <div className="grid gap-4">
            {orders.map((order, index) => {
              const status = orderStatus(order)
              const products = order.cartItems ?? []
              const totalItems = products.reduce((sum, item) => sum + item.count, 0)
              const orderNumber = order.id ?? order._id.slice(-8).toUpperCase()
              return (
                <details key={order._id} open={index === 0} className="group overflow-hidden rounded-2xl border border-[#e1e7e3] bg-white shadow-sm">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4 px-4 py-4 transition hover:bg-[#fcfdfc] sm:px-6">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-3">
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f1f8f3] text-[#118a46]"><ShoppingBag size={20}/></span>
                      <div className="min-w-32"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(status)}`}>{status}</span><p className="mt-1.5 text-sm font-bold">Order #{orderNumber}</p></div>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#758094]"><CalendarDays size={14}/>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unavailable'}</span>
                      <span className="text-xs text-[#758094]">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3"><strong className="text-sm text-[#118a46] sm:text-base">{formatPrice(order.totalOrderPrice)}</strong><ChevronDown size={17} className="text-[#8490a0] transition-transform group-open:rotate-180"/></div>
                  </summary>

                  <div className="border-t border-[#edf0f2] px-4 py-5 sm:px-6">
                    <h2 className="mb-3 text-sm font-bold">Order Items</h2>
                    {products.length === 0 ? <p className="rounded-lg bg-[#f7f9f8] p-4 text-sm text-[#758094]">Item details are not available for this order.</p> : <div className="grid gap-2.5">{products.map((item, itemIndex) => (
                      <div key={item._id ?? `${order._id}-${itemIndex}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#edf0f2] p-3 sm:px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          {item.product?.imageCover ? <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-[#edf0f2] bg-white"><Image src={item.product.imageCover} alt={item.product.title ?? 'Order product'} fill sizes="48px" className="object-contain p-1"/></span> : <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#f1f8f3] text-[#12a857]"><Package size={18}/></span>}
                          <div className="min-w-0"><p className="truncate text-sm font-medium">{item.product?.title ?? 'Product'}</p><p className="mt-1 text-xs text-[#8490a0]">{item.count} × {formatPrice(item.price)}</p></div>
                        </div>
                        <strong className="shrink-0 text-sm">{formatPrice(item.count * item.price)}</strong>
                      </div>
                    ))}</div>}

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <section className="rounded-xl bg-[#f7f9f8] p-4"><h3 className="flex items-center gap-2 text-sm font-bold"><MapPin size={15} className="text-[#12a857]"/>Delivery Address</h3><p className="mt-2 text-sm text-[#596579]">{order.shippingAddress?.details || 'Address information not available'}</p>{order.shippingAddress?.city && <p className="mt-1 text-xs text-[#758094]">{order.shippingAddress.city}</p>}{order.shippingAddress?.phone && <p className="mt-2 text-xs text-[#758094]">{order.shippingAddress.phone}</p>}</section>
                      <section className="rounded-xl border border-[#f0e2ae] bg-[#fff9df] p-4"><h3 className="flex items-center gap-2 text-sm font-bold"><Truck size={15} className="text-[#d89100]"/>Order Summary</h3><div className="mt-3 flex justify-between text-xs text-[#758094]"><span>Shipping</span><span className="font-semibold text-[#118a46]">FREE</span></div><div className="mt-2 flex justify-between border-t border-[#eedfa3] pt-3 text-sm font-bold"><span>Total</span><span className="text-[#118a46]">{formatPrice(order.totalOrderPrice)}</span></div><p className="mt-2 text-[11px] text-[#758094]">Payment: {order.paymentMethodType || (order.isPaid ? 'Paid online' : 'Cash on delivery')}</p></section>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
