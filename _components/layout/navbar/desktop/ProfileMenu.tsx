"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  BookUser,
  Heart,
  LogOut,
  Package,
  Settings,
  UserRound,
} from "lucide-react";
import { CgProfile } from "react-icons/cg";

const menuItems: { label: string; icon: typeof Package; href?: string }[] = [
  { label: "My Orders", icon: Package, href: "/orders" },
  { label: "My Wishlist", icon: Heart, href: "/wishlist" },
  { label: "Addresses", icon: BookUser, href: "/addresses" },
  { label: "Settings", icon: Settings, href: "/profile" },
];

export default function ProfileMenu() {
  const { data } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userName = data?.user?.name || data?.user?.email?.split("@")[0] || "username";

  useEffect(() => {
    if (!isOpen) return;

    function closeMenu(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative ml-2">
      <button
        type="button"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-[#64748B] transition-all duration-200 hover:scale-105 hover:bg-[#F0FDF4] hover:text-[#16A34A] active:scale-95"
      >
        <CgProfile size={24} />
      </button>

      <div
        role="menu"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute right-0 top-[calc(100%+10px)] z-[60] w-[296px] origin-top-right overflow-hidden rounded-[18px] border border-slate-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition-all duration-200 ease-out motion-reduce:transition-none ${isOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-[0.98] opacity-0"}`}
      >
        <div className="flex min-h-[78px] items-center gap-3.5 border-b border-slate-100 px-4 py-3">
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#E5F9EC] text-[#16A34A] transition-transform duration-200 hover:scale-105">
            <UserRound size={25} strokeWidth={1.8} />
          </div>
          <span className="truncate text-[15px] font-medium text-[#172033]">{userName}</span>
        </div>

        <div className="py-1.5">
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="group flex h-[46px] items-center gap-3.5 px-4 text-[14px] text-[#596579] transition-all duration-150 hover:bg-[#F0FDF4] hover:pl-[18px] hover:text-[#16A34A] focus-visible:bg-[#F0FDF4] focus-visible:text-[#16A34A]"
          >
            <UserRound size={18} className="text-[#98A2B3] transition-colors group-hover:text-[#16A34A]" />
            <span>My Profile</span>
          </Link>

          {menuItems.map(({ label, icon: Icon, href }) => (
            href ? (
              <Link key={label} href={href} role="menuitem" onClick={() => setIsOpen(false)} className="group flex h-[46px] items-center gap-3.5 px-4 text-[14px] text-[#596579] transition-all duration-150 hover:bg-[#F0FDF4] hover:pl-[18px] hover:text-[#16A34A]">
                <Icon size={18} className="text-[#98A2B3] transition-colors group-hover:text-[#16A34A]" />
                <span>{label}</span>
              </Link>
            ) : (
              <div key={label} role="menuitem" aria-disabled="true" className="group flex h-[46px] items-center gap-3.5 px-4 text-[14px] text-[#596579] transition-all duration-150 hover:bg-[#F0FDF4] hover:pl-[18px] hover:text-[#16A34A]">
                <Icon size={18} className="text-[#98A2B3] transition-colors group-hover:text-[#16A34A]" />
                <span>{label}</span>
              </div>
            )
          ))}
        </div>

        <div className="border-t border-slate-100 py-1.5">
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
            className="group flex h-[46px] w-full items-center gap-3.5 px-4 text-[14px] text-[#F5222D] transition-all duration-150 hover:bg-red-50 hover:pl-[18px] focus-visible:bg-red-50"
          >
            <LogOut size={18} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
