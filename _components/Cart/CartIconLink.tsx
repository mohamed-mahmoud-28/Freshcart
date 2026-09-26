'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FaCartShopping } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { useDispatch } from 'react-redux'
import { clearCart } from '@/lib/store/cartSlice'
import type { AppDispatch } from '@/lib/store'
import { useEffect } from 'react'
import { CART_QUERY_KEY, fetchCart } from './useCart'

type CartIconLinkProps = { className?: string }

export default function CartIconLink({ className = '' }: CartIconLinkProps) {
  const { status } = useSession()
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => { if (status === 'unauthenticated') { dispatch(clearCart()); queryClient.removeQueries({ queryKey: ['cart'] }) } }, [dispatch, queryClient, status])
  const { data } = useQuery({
    queryKey: CART_QUERY_KEY,
    enabled: status === 'authenticated',
    queryFn: fetchCart,
  })
  const cartState = useSelector((state: RootState) => state.cart)
  const itemCount = cartState.data ? cartState.itemCount : data?.data?.products.reduce((sum, item) => sum + item.count, 0) ?? data?.numOfCartItems ?? 0

  return (
    <Link href="/cart" aria-label={`Cart${itemCount ? `, ${itemCount} items` : ''}`} className={`relative flex h-12 w-12 items-center justify-center rounded-full text-[#64748B] transition-all duration-200 hover:scale-105 hover:bg-[#F0FDF4] hover:text-[#16A34A] active:scale-95 ${className}`}>
      <FaCartShopping size={25} />
      {itemCount > 0 && <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-[#12a857] px-1 text-[10px] font-bold leading-none text-white shadow-sm" aria-hidden="true">{itemCount > 99 ? '99+' : itemCount}</span>}
    </Link>
  )
}
