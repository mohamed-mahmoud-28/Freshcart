import { Suspense } from "react";
import CategoriesComp from "./CategoriesComp";

function CategoriesError() {
    return (
        <div className="rounded-[18px] border border-[#e7edf3] bg-[#f9f9f9] px-6 py-10 text-center">
            <h2 className="text-xl font-bold text-[#1f2a37]">Categories are unavailable</h2>
            <p className="mt-2 text-sm text-gray-500">Please try again shortly.</p>
        </div>
    );
}

function CategoriesSkeleton() {
    return (
        <section className="p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-2 rounded-full bg-gray-300" />
                    <div className="h-8 w-52 animate-pulse rounded-xl bg-gray-200" />
                </div>
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="mx-auto flex h-[148px] w-full max-w-[237.3300018310547px] flex-col items-center justify-center rounded-[18px] border border-[#e7edf3] bg-[#f9f9f9] px-3 py-4"
                    >
                        <div className="mb-4 h-[80px] w-[80px] animate-pulse rounded-full bg-gray-200" />
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function Categories() {
    return (
        <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesComp fallback={<CategoriesError />} />
        </Suspense>
    );
}