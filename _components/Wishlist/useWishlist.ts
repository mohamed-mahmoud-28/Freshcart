"use client"

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import type { Products } from '@/interfaces/products'
import type { WishlistResponse } from '@/interfaces/shop'
import { clearWishlist, setWishlist } from '@/lib/store/wishlistSlice'
import type { AppDispatch } from '@/lib/store'

export const WISHLIST_QUERY_KEY = ['wishlist'] as const

function getWishlistProducts(response: WishlistResponse): Products[] {
  if (Array.isArray(response.data)) return response.data
  return response.data?.products ?? []
}

async function fetchWishlist(): Promise<Products[]> {
  const response = await fetch('/api/wishlist')
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message ?? 'Failed to load wishlist')
  return getWishlistProducts(payload as WishlistResponse)
}

async function changeWishlist({ productId, method }: { productId: string; method: 'POST' | 'DELETE' }) {
  const url = method === 'DELETE' ? `/api/wishlist?productId=${encodeURIComponent(productId)}` : '/api/wishlist'
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(method === 'POST' ? { body: JSON.stringify({ productId }) } : {}),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message ?? 'Failed to update wishlist')
  return payload as WishlistResponse
}

export function useWishlist() {
  const { status } = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: fetchWishlist,
    enabled: status === 'authenticated',
    retry: false,
  })
  useEffect(() => { if (status === 'unauthenticated') { dispatch(clearWishlist()); queryClient.removeQueries({ queryKey: WISHLIST_QUERY_KEY }) } else dispatch(setWishlist(query.data?.map((product) => product._id) ?? [])) }, [dispatch, query.data, queryClient, status])
  const mutation = useMutation({
    mutationFn: changeWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  })

  return {
    ...query,
    isSignedIn: status === 'authenticated',
    toggleWishlist: mutation.mutateAsync,
    isUpdatingWishlist: mutation.isPending,
  }
}
