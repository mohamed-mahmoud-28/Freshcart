import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getCategories } from "@/API/CategoryAPI/getspecificcategory";
import type { Category } from "@/interfaces/category";

type CategoriesCompProps = {
    fallback: ReactNode;
};

export default async function CategoriesComp({ fallback }: CategoriesCompProps) {
    let categories: Category[];
    try {
        categories = await getCategories();
    } catch {
        return fallback;
    }

    return (
        <section className="p-6">
            <div className=" mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span
                        className="h-9 w-2 rounded-full bg-linear-to-b from-emerald-500 to-emerald-700"
                        aria-hidden="true"
                    />
                    <h2 className="text-[2.3rem] font-black tracking-[-0.06em] text-[#1f2a37]">
                        <span className="mr-2">Shop By</span>
                        <Link href="/categories" className="inline-block text-[#0e8f62] transition hover:text-[#0a744f]">
                            Category
                        </Link>
                    </h2>
                </div>

                <Link
                    href="/categories"
                    className="inline-flex items-center gap-2 text-[1.05rem] font-semibold text-[#16a16f] transition hover:text-[#11875d]"
                >
                    View All Categories
                    <span aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
                {categories.length === 0 ? (
                    <p className="col-span-full py-8 text-center text-sm text-gray-500">No categories available.</p>
                ) : categories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/products?category=${encodeURIComponent(category.slug)}`}
                        className="mx-auto flex h-[148px] w-full max-w-[237.3300018310547px] flex-col items-center justify-center rounded-[18px] border border-[#e7edf3] bg-[#f9f9f9] px-3 py-4 shadow-[0_0_0_1px_rgba(15,23,42,0.02)] transition duration-200 hover:shadow-md"
                    >
                        <div className="mb-4 flex h-[86px] w-[86px] items-center justify-center overflow-hidden rounded-full bg-[#f0f2f4] ring-1 ring-[#e7edf3]">
                            <Image
                                src={category.image}
                                alt={category.name}
                                width={86}
                                height={86}
                                className="h-[80px] w-[80px] object-cover"
                            />
                        </div>

                        <h3 className="text-center text-[1.05rem] font-semibold text-[#303746]">
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}