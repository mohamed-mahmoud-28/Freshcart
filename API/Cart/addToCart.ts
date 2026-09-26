'use server'

import { getUserToken } from '@/utilities/Token'
import { addProductWithToken } from './cartApi'

export async function addToCart(productId: string) {
  const token = await getUserToken()
  if (!token) throw new Error('Unauthorized')
  if (!/^[a-f\d]{24}$/i.test(productId)) throw new Error('Invalid product ID')

  return addProductWithToken(token, productId)
}
