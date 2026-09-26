export interface CartProductDetails {
  _id: string
  title: string
  slug?: string
  description?: string
  imageCover: string
  price: number
  quantity?: number
  category?: {
    _id: string
    name: string
    slug?: string
  }
  brand?: {
    _id: string
    name: string
  }
}

export interface CartItem {
  _id?: string
  count: number
  price: number
  product: CartProductDetails
}

export interface CartData {
  _id?: string
  products: CartItem[]
  totalCartPrice: number
  totalCartPriceAfterDiscount?: number
  cartId?: string
}

export interface CartResponse {
  status?: string
  numOfCartItems?: number
  cartId?: string
  data?: CartData
  message?: string
}
