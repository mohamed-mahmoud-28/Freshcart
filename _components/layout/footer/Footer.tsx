import Image from "next/image";
import Link from "next/link";
import {
    Headphones,
    Mail,
    MapPin,
    Phone,
    RotateCcw,
    ShieldCheck,
    Truck,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

const benefits = [
    { title: "Free Shipping", description: "On orders over 500 EGP", icon: Truck },
    { title: "Easy Returns", description: "14-day return policy", icon: RotateCcw },
    { title: "Secure Payment", description: "100% secure checkout", icon: ShieldCheck },
    { title: "24/7 Support", description: "Contact us anytime", icon: Headphones },
];

const footerLinks = [
    {
        title: "Shop",
        links: [{ label: "All Products", href: "/products" }, { label: "Categories", href: "/categories" }, { label: "Brands", href: "/brands" }, { label: "Electronics", href: "/categories" }, { label: "Men's Fashion", href: "/categories" }, { label: "Women's Fashion", href: "/categories" }],
    },
    {
        title: "Account",
        links: [{ label: "My Account", href: "/profile" }, { label: "Order History", href: "/orders" }, { label: "Wishlist", href: "/wishlist" }, { label: "Shopping Cart", href: "/cart" }, { label: "Sign In", href: "/login" }, { label: "Create Account", href: "/register" }],
    },
    {
        title: "Support",
        links: [{ label: "Contact Us", href: "mailto:support@freshcart.com" }, { label: "Help Center", href: "mailto:support@freshcart.com" }, { label: "Shipping Info", href: "/terms" }, { label: "Returns & Refunds", href: "/terms" }, { label: "Track Order", href: "/orders" }],
    },
    {
        title: "Legal",
        links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }, { label: "Cookie Policy", href: "/privacy#cookies" }],
    },
];

const socialLinks = [
    { label: "Facebook", icon: FaFacebookF },
    { label: "X", icon: FaXTwitter },
    { label: "Instagram", icon: FaInstagram },
    { label: "YouTube", icon: FaYoutube },
];

function FooterLink({ label, href }: { label: string; href: string }) {
    return (
        <Link href={href} className="text-sm text-[#a7b6ca] transition hover:text-[#22c982]">
            {label}
        </Link>
    );
}

export default function Footer() {
    return (
        <footer className="mt-auto">
            <section className="border-y border-[#d8f3e8] bg-[#effff7]" aria-label="FreshCart benefits">
                <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-[#d7f1e5] sm:grid-cols-4">
                    {benefits.map(({ title, description, icon: Icon }) => (
                        <div key={title} className="flex items-center gap-3 px-4 py-5 sm:px-5 lg:gap-4 lg:px-7 lg:py-6">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#d9fae9] text-[#0ca653] lg:h-14 lg:w-14">
                                <Icon size={23} strokeWidth={2.2} />
                            </span>
                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-bold text-[#172b40] lg:text-base">{title}</h2>
                                <p className="mt-0.5 text-xs text-[#60758b] lg:text-sm">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="bg-[#101b2d] text-white">
                <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.65fr_repeat(4,1fr)] lg:gap-8 lg:px-10 lg:py-14">
                    <div className="max-w-[390px]">
                        <Link href="/" className="inline-flex rounded-[10px] bg-white px-4 py-3 transition hover:bg-[#effff7]">
                            <Image src="/Assets/images/freshcart-logo.svg" alt="FreshCart" width={160} height={31} className="h-auto w-[155px]" />
                        </Link>
                        <p className="mt-7 text-sm leading-7 text-[#a7b6ca]">
                            FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
                        </p>

                        <div className="mt-6 space-y-3 text-sm text-[#a7b6ca]">
                            <a href="tel:+18001234567" className="flex items-center gap-3 transition hover:text-[#22c982]"><Phone size={17} className="text-[#16bf70]" /> +1 (800) 123-4567</a>
                            <a href="mailto:support@freshcart.com" className="flex items-center gap-3 transition hover:text-[#22c982]"><Mail size={17} className="text-[#16bf70]" /> support@freshcart.com</a>
                            <span className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-[#16bf70]" /> 123 Commerce Street, New York, NY 10001</span>
                        </div>

                        <div className="mt-7 flex items-center gap-3">
                            {socialLinks.map(({ label, icon: Icon }) => (
                                <a key={label} href={`#${label.toLowerCase()}`} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d2b40] text-[#a7b6ca] transition hover:bg-[#16bf70] hover:text-white">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map(({ title, links }) => (
                        <nav key={title} aria-label={`${title} links`}>
                            <h2 className="text-lg font-bold text-white">{title}</h2>
                            <ul className="mt-6 space-y-4">
                                {links.map(({ label, href }) => <li key={label}><FooterLink label={label} href={href} /></li>)}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="border-t border-white/[0.08]">
                    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-5 text-xs text-[#8192aa] sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                        <p>© 2026 FreshCart. All rights reserved.</p>
                        <div className="flex flex-wrap items-center gap-4">
                            <span>▣ Visa</span>
                            <span>▣ Mastercard</span>
                            <span>▣ PayPal</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
