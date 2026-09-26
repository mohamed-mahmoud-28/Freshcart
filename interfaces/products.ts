import type { Category } from './category'

export interface Products{
    sold: number
    images: string[]
    subcategory: Subcategory[]
    ratingsQuantity: number
    _id: string
    title: string
    slug: string
    description: string
    quantity: number
    price: number
    imageCover: string
    category: Category
    brand: Brand
    ratingsAverage: number
    createdAt: string
    updatedAt: string
    id: string
    priceAfterDiscount?: number
    availableColors?: string[]
    reviews?: Review[]
}

export interface Review {
    _id: string
    review: string
    rating: number
    user: { _id: string; name: string }
    createdAt: string
}

export interface Subcategory {
    _id: string
    name: string
    slug: string
    category: string
}

export type { Category } from './category'

export interface Brand {
    _id: string
    name: string
    slug: string
    image: string
}

