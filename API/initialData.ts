import 'server-only'
import { getServerSession } from 'next-auth'
import Authoption from '@/next-auth/auth/authoption'
import { getUserToken } from '@/utilities/Token'
import { getCartWithToken } from '@/API/Cart/cartApi'
import { getWishlistWithToken } from '@/API/Wishlist/wishlistApi'
import { getCategories } from '@/API/CategoryAPI/getspecificcategory'
import type { CartResponse } from '@/interfaces/cart'
import type { Products } from '@/interfaces/products'
import type { WishlistResponse } from '@/interfaces/shop'

function wishlistProducts(response: WishlistResponse): Products[] {
  if (Array.isArray(response.data)) return response.data
  return response.data?.products ?? []
}

export async function getAppInitialData() {
  const [session, categories] = await Promise.all([
    getServerSession(Authoption),
    getCategories().catch(() => []),
  ])

  let initialCart: CartResponse | undefined
  let initialWishlist: Products[] | undefined
  if (session) {
    const token = await getUserToken()
    if (token) {
      const [cartResult, wishlistResult] = await Promise.allSettled([getCartWithToken(token), getWishlistWithToken(token)])
      if (cartResult.status === 'fulfilled') initialCart = cartResult.value
      if (wishlistResult.status === 'fulfilled') initialWishlist = wishlistProducts(wishlistResult.value)
    }
  }

  return { session, categories, initialCart, initialWishlist }
}
