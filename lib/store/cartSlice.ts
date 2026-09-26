import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartResponse } from '@/interfaces/cart'

type CartState = { data: CartResponse | null; itemCount: number }
const initialState: CartState = { data: null, itemCount: 0 }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartResponse | null>) {
      state.data = action.payload
      state.itemCount = action.payload?.data?.products.reduce((sum, item) => sum + item.count, 0) ?? action.payload?.numOfCartItems ?? 0
    },
    clearCart(state) { state.data = null; state.itemCount = 0 },
  },
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
