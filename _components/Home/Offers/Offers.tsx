import Link from "next/link";

const offers = [
    {
        id: "organic-fruits",
        badge: "Deal of the Day",
        badgeIcon: "🔥",
        title: "Fresh Organic Fruits",
        description: "Get up to 40% off on selected organic fruits",
        discount: "40% OFF",
        code: "ORGANIC40",
        cta: "Shop Now",
        bgClass: "bg-gradient-to-br from-emerald-500 to-emerald-700",
        badgeClass: "border border-white/25 bg-white/15 text-white",
        textClass: "text-white",
        discountClass: "text-white",
        buttonClass: "bg-white text-[#0f9f6a] hover:bg-[#f7f9f8]",
    },
    {
        id: "exotic-vegetables",
        badge: "New Arrivals",
        badgeIcon: "✨",
        title: "Exotic Vegetables",
        description: "Discover our latest collection of premium vegetables",
        discount: "25% OFF",
        code: "FRESH25",
        cta: "Explore Now",
        bgClass: "bg-gradient-to-br from-orange-400 to-rose-500",
        badgeClass: "border border-white/25 bg-white/15 text-white",
        textClass: "text-white",
        discountClass: "text-white",
        buttonClass: "bg-white text-[#f26f4c] hover:bg-[#fff7f3]",
    },
] as const;

export default function Offers() {
    return (
        <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-6 xl:grid-cols-2">
                {offers.map((offer) => (
                    <article
                        key={offer.id}
                        className={`relative isolate h-[300px] w-full overflow-hidden rounded-[30px] px-7 py-6 shadow-[0_12px_35px_rgba(11,17,43,0.12)] sm:px-8 ${offer.bgClass}`}
                    >
                        {/* Decorative shapes */}
                        <div
                            className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full border border-white/15 bg-white/5"
                            aria-hidden="true"
                        />

                        <div
                            className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-white/10 bg-white/5"
                            aria-hidden="true"
                        />

                        <div
                            className="pointer-events-none absolute -right-20 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
                            aria-hidden="true"
                        />

                        <div
                            className="pointer-events-none absolute -bottom-10 -left-20 h-52 w-52 rounded-full bg-white/10 blur-3xl"
                            aria-hidden="true"
                        />

                        <div
                            className="pointer-events-none absolute bottom-8 right-24 h-8 w-8 rounded-full border border-white/20 bg-white/10"
                            aria-hidden="true"
                        />

                        {/* Content */}
                        <div className="relative z-10 flex h-full flex-col">
                            {/* Badge */}
                            <div
                                className={`mb-3 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-md ${offer.badgeClass}`}
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f5a623] text-[10px] text-white shadow-sm">
                                    {offer.badgeIcon}
                                </span>

                                <span>{offer.badge}</span>
                            </div>

                            {/* Title */}
                            <h2
                                className={`mb-2 max-w-[570px] text-[2rem] font-black leading-[1.05] tracking-[-0.055em] sm:text-[2.35rem] ${offer.textClass}`}
                            >
                                {offer.title}
                            </h2>

                            {/* Description */}
                            <p
                                className={`mb-4 max-w-[520px] text-sm font-medium leading-relaxed opacity-95 sm:text-base ${offer.textClass}`}
                            >
                                {offer.description}
                            </p>

                            {/* Discount */}
                            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span
                                    className={`text-[2rem] font-black leading-none tracking-[-0.055em] sm:text-[2.35rem] ${offer.discountClass}`}
                                >
                                    {offer.discount}
                                </span>

                                <span className="text-[12px] text-gray-200 sm:text-base">
                                    Use code:
                                    <span className="ml-1 font-bold text-white tracking-[0.06em]">
                                        {offer.code}
                                    </span>
                                </span>
                            </div>

                            {/* Button */}
                            <Link
                                href="/products"
                                className={`group mt-auto inline-flex w-fit items-center justify-center rounded-full px-5 py-2.5 text-base font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 ${offer.buttonClass}`}
                            >
                                <span>{offer.cta}</span>

                                <span className="ml-2 text-xl leading-none transition-transform duration-200 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}