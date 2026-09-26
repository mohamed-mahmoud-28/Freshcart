"use client"

import { Heart } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from '@/components/ui/toast'
import { useSelector } from 'react-redux'
import type { RootState } from '@/lib/store'
import { useWishlist } from './useWishlist'
import type { ReactNode } from 'react'

export default function WishlistButton({ productId, productTitle, className = '', children }: { productId: string; productTitle: string; className?: string; children?: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useSession()
  const { data: products, toggleWishlist, isUpdatingWishlist } = useWishlist()
  const savedIds = useSelector((state: RootState) => state.wishlist)
  const [isSaving, setIsSaving] = useState(false)
  const isFavorite = products ? savedIds.includes(productId) : false

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    setIsSaving(true)
    try {
      await toggleWishlist({ productId, method: isFavorite ? 'DELETE' : 'POST' })
      toast.add({ type: 'success', description: isFavorite ? 'Removed from wishlist.' : 'Added to wishlist.' })
    } catch (error) {
      toast.add({ type: 'error', description: error instanceof Error ? error.message : 'Could not update wishlist.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? `Remove ${productTitle} from wishlist` : `Add ${productTitle} to wishlist`}
      aria-pressed={isFavorite}
      onClick={handleClick}
      disabled={isSaving || isUpdatingWishlist}
      className={`${className} disabled:cursor-wait disabled:opacity-60`}
    >
      <Heart size={17} strokeWidth={2} fill={isFavorite ? 'currentColor' : 'none'} />
      {children}
    </button>
  )
}
