"use client";

import Image from "next/image";
import Link from "next/link";
import { Headphones, Heart, X } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { signOut, useSession } from 'next-auth/react'

import { navigationLinks } from "@/constants/navigation";
import MobileSearch from "./MobileSearch";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { status } = useSession()
  return (
    <>
      <button type="button" aria-label="Close menu" onClick={onClose} className={`lg:hidden fixed inset-0 z-[9998] bg-black/50 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`lg:hidden fixed right-0 top-0 z-[9999] h-dvh w-[min(330px,80vw)] overflow-y-auto bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-[72px] items-center justify-between border-b border-[#E5E7EB] px-4">
          <Link href="/" onClick={onClose}><Image src="/Assets/images/freshcart-logo.svg" alt="FreshCart" width={160} height={36} className="h-auto w-[145px]" /></Link>
          <button type="button" onClick={onClose} aria-label="Close menu" className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F3F4F6] text-[#475569] transition-all hover:bg-[#F0FDF4] hover:text-[#16A34A]"><X size={20} strokeWidth={2} /></button>
        </div>

        <div className="px-4 py-4">
          <MobileSearch />
          <nav className="space-y-1">
            {navigationLinks.map((link, index) => (
              <Link key={link.href} href={link.href} onClick={onClose} className={`flex h-[48px] items-center rounded-xl px-4 text-[16px] font-normal ${index === 0 ? "bg-[#F0FDF4] text-[#16A34A]" : "text-[#334155] transition-all hover:bg-[#F0FDF4] hover:text-[#16A34A]"}`}>{link.title}</Link>
            ))}
          </nav>

          <div className="my-3 border-t border-[#E5E7EB]" />
          <Link href="/wishlist" onClick={onClose} className="group flex h-[52px] items-center gap-3 rounded-xl px-3 transition-all hover:bg-[#F0FDF4]"><div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#FFF1F2] transition-all group-hover:bg-white"><Heart size={19} strokeWidth={1.8} className="text-red-500" /></div><span className="text-[15px] text-[#334155] transition-colors group-hover:text-[#16A34A]">Wishlist</span></Link>
          <Link href="/cart" onClick={onClose} className="group mt-1 flex h-[52px] items-center gap-3 rounded-xl px-3 transition-all hover:bg-[#F0FDF4]"><div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F0FDF4] transition-all group-hover:bg-white"><FaCartShopping size={18} className="text-[#16A34A]" /></div><span className="text-[15px] text-[#334155] transition-colors group-hover:text-[#16A34A]">Cart</span></Link>

          <div className="my-3 border-t border-[#E5E7EB]" />
          {status === 'authenticated' ? <div className="grid gap-2"><Link href="/profile" onClick={onClose} className="flex h-11 items-center rounded-xl border px-4 text-sm text-slate-700">My Account</Link><Link href="/orders" onClick={onClose} className="flex h-11 items-center rounded-xl border px-4 text-sm text-slate-700">My Orders</Link><Link href="/addresses" onClick={onClose} className="flex h-11 items-center rounded-xl border px-4 text-sm text-slate-700">My Addresses</Link><button type="button" onClick={() => { onClose(); void signOut({ callbackUrl: '/login' }) }} className="h-11 rounded-xl bg-red-50 text-sm font-medium text-red-600">Sign Out</button></div> : <div className="grid grid-cols-2 gap-3"><Link href="/login" onClick={onClose} className="flex h-[48px] items-center justify-center rounded-xl bg-[#16A34A] text-[15px] font-medium text-white transition-all hover:bg-[#15803D] active:scale-[0.98]">Sign In</Link><Link href="/register" onClick={onClose} className="flex h-[48px] items-center justify-center rounded-xl border border-[#16A34A] bg-white text-[15px] font-medium text-[#16A34A] transition-all hover:bg-[#F0FDF4] active:scale-[0.98]">Sign Up</Link></div>}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3.5"><div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]"><Headphones size={20} strokeWidth={2} className="text-[#16A34A]" /></div><div><p className="text-[14px] font-medium text-[#334155]">Need Help?</p><p className="text-[13px] text-[#16A34A]">Contact Support</p></div></div>
        </div>
      </aside>
    </>
  );
}
