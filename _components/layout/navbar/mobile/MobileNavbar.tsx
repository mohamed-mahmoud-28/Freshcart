"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import CartIconLink from "@/_components/Cart/CartIconLink";
import WishlistIconLink from "@/_components/Wishlist/WishlistIconLink";

import MobileMenu from "./MobileMenu";

export default function MobileNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed left-0 top-0 z-40 flex h-[68px] w-full items-center border-b border-slate-100 bg-white px-4 sm:px-5 lg:px-6 lg:hidden">
        <Link href="/" className="shrink-0"><Image src="/Assets/images/freshcart-logo.svg" alt="FreshCart" width={180} height={40} priority className="h-auto w-[145px] lg:w-[165px]" /></Link>
        <div className="ml-auto flex shrink-0 items-center">
          <WishlistIconLink />
          <CartIconLink />
          <button type="button" aria-label="Open menu" onClick={() => setMobileMenuOpen(true)} className="ml-1 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#16A34A] text-white transition-all hover:bg-[#15803D]"><Menu size={20} strokeWidth={1.8} /></button>
        </div>
      </header>
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
