import type { Products } from "@/interfaces/products";


export async function getProducts(): Promise<Products[]> {
  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return data.data;
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<Products> {
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();
  return data.data;
}
