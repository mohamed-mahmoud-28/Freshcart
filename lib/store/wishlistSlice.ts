import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [] as string[],
  reducers: {
    setWishlist: (_state, action: PayloadAction<string[]>) => action.payload,
    clearWishlist: () => [],
  },
})

export const { setWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
