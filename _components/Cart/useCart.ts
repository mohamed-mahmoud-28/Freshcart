'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CartResponse } from '@/interfaces/cart'
import { setCart } from '@/lib/store/cartSlice'
import type { AppDispatch } from '@/lib/store'
import { useSession } from 'next-auth/react'

export const CART_QUERY_KEY = ['cart'] as const

export async function fetchCart(): Promise<CartResponse> {
  const response = await fetch('/api/cart')
  const payload = await response.json().catch(() => null)

  if (!response.ok) throw new Error(payload?.message ?? 'Failed to load cart')
  return payload as CartResponse
}

async function updateCartQuantity({ productId, count }: { productId: string; count: number }) {
  const response = await fetch('/api/cart', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, count }),
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) throw new Error(payload?.message ?? 'Failed to update cart quantity')
  return payload as CartResponse
}

async function deleteCartItems({ productId }: { productId?: string }) {
  const response = await fetch('/api/cart', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productId ? { productId } : {}),
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) throw new Error(payload?.message ?? 'Failed to remove cart items')
  return payload as CartResponse
}

async function applyCartCoupon(coupon: string) {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ coupon }),
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) throw new Error(payload?.message ?? 'Failed to apply promo code')
  return payload as CartResponse
}

export function useCart() {
  const queryClient = useQueryClient()
  const { status } = useSession()
  const query = useQuery({ queryKey: CART_QUERY_KEY, queryFn: fetchCart, enabled: status === 'authenticated', retry: false })
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => { if (query.data) dispatch(setCart(query.data)) }, [dispatch, query.data])
  const quantityMutation = useMutation({
    mutationFn: updateCartQuantity,
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteCartItems,
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  })
  const couponMutation = useMutation({
    mutationFn: applyCartCoupon,
    onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
  })

  return {
    ...query,
    updateQuantity: quantityMutation.mutate,
    removeCartItems: deleteMutation.mutateAsync,
    applyCoupon: couponMutation.mutateAsync,
    isApplyingCoupon: couponMutation.isPending,
    isCartBusy: quantityMutation.isPending || deleteMutation.isPending,
    quantityError: quantityMutation.error,
    isDeleting: deleteMutation.isPending,
  }
}
