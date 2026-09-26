import type { Products, Review } from './products'
import type { Category } from './category'

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Subcategory {
  _id: string
  name: string
  slug: string
  category: string | Category
}

export interface WishlistResponse {
  status?: string
  message?: string
  count?: number
  data?: Products[] | { products?: Products[] }
}

export interface ReviewsResponse {
  data?: Review[]
  results?: number
  message?: string
}
