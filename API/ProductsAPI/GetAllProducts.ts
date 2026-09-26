import 'server-only'
import { getProduct as getCatalogProduct, getProducts as getCatalogProducts } from '@/API/Shop/shopApi'
import type { Products } from "@/interfaces/products";


export async function getProducts(): Promise<Products[]> {
  try { return await getCatalogProducts() } catch { return [] }
}

export async function getProduct(id: string): Promise<Products> {
  return getCatalogProduct(id)
}
