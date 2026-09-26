import Link from "next/link";
import { getProducts } from "@/API/ProductsAPI/GetAllProducts";
import type { Products as Product } from "@/interfaces/products";
import ProductCard from "@/_components/Home/Products/ProductCard";

export default async function Products() {
    let products: Product[] = [];

    try {
        products = (await getProducts());
    } catch {
        return null;
    }

    return (
        <section className="w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10" aria-labelledby="featured-products-title">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <span className="h-9 w-1.5 shrink-0 rounded-full bg-[#09a66a]" aria-hidden="true" />
                        <h2 id="featured-products-title" className="text-[1.75rem] font-bold leading-none text-[#1f3047] sm:text-[2rem]">
                            Featured <span className="text-[#079b5b]">Products</span>
                        </h2>
                    </div>
                    <Link href="/products" className="shrink-0 text-sm font-semibold text-[#0b9f5a] transition hover:text-[#067c45] sm:text-base">
                        View all <span aria-hidden="true">→</span>
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 items-start justify-items-center gap-3 min-[480px]:gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
                        {products.map((product) => (
                            <div key={product._id} className="w-full max-w-[275.19px]">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="rounded-lg border border-dashed border-[#dce5e0] py-12 text-center text-sm text-[#64748b]">No products available right now.</p>
                )}
            </div>
        </section>
    );
}
