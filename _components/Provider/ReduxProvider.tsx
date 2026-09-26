'use client'

import { useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, type RootState } from '@/lib/store'

export default function ReduxProvider({ children, initialState }: { children: React.ReactNode; initialState?: Partial<RootState> }) {
  const [store] = useState(() => makeStore(initialState))
  return <Provider store={store}>{children}</Provider>
}
