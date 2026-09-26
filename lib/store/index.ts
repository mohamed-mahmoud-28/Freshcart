import { combineReducers, configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'

const reducer = combineReducers({ cart: cartReducer, wishlist: wishlistReducer })
export type RootState = ReturnType<typeof reducer>
export const makeStore = (preloadedState?: Partial<RootState>) => configureStore({ reducer, preloadedState })
export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
