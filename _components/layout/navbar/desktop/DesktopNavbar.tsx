"use client";

import Image from "next/image";
import Link from "next/link";
import { Headphones, Search, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import CartIconLink from "@/_components/Cart/CartIconLink";
import WishlistIconLink from "@/_components/Wishlist/WishlistIconLink";
import ProfileMenu from "@/_components/layout/navbar/desktop/ProfileMenu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/interfaces/category";

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories')
  const payload = await response.json().catch(() => null)
  if (!response.ok) throw new Error(payload?.message ?? 'Could not load categories.')
  return payload?.data ?? []
}

const featuredCategoryNames = ["Electronics", "Women's Fashion", "Men's Fashion", "Beauty & Health"];

function getCategoryMenuItems(categories: Category[]) {
  const featured = featuredCategoryNames
    .map((name) => categories.find((category) => category.name.toLowerCase().replace(/[^a-z0-9]/g, "") === name.toLowerCase().replace(/[^a-z0-9]/g, "")))
    .filter((category): category is Category => Boolean(category));

  const menuCategories = featured.length > 0 ? featured : categories;
  return [
    { title: "All Categories", href: "/categories" },
    ...menuCategories.map((category) => ({ title: category.name, href: `/categories/${category._id}` })),
  ];
}

export default function DesktopNavbar({ isScrolled }: { isScrolled: boolean }) {

  const { status } = useSession();
  const { data: categoryData = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories, staleTime: 5 * 60 * 1000, retry: false });
  const categoryMenuItems = getCategoryMenuItems(categoryData);

  return (
    <header className={`fixed left-0 z-40 hidden w-full border-b border-slate-100 bg-white transition-[top] duration-300 motion-reduce:transition-none lg:block ${isScrolled ? "top-0" : "top-[38px]"}`}>
      <div className="mx-auto flex h-[68px] w-full items-center gap-4 px-4 sm:px-5 lg:px-6">
        <Link href="/" className="shrink-0">
          <Image src="/Assets/images/freshcart-logo.svg" alt="FreshCart" width={180} height={40} priority className="h-auto w-[145px] lg:w-[165px]" />
        </Link>

        <form action="/products" method="get" className="hidden min-w-0 flex-1 lg:flex">
          <div className="relative w-full">
            <Input name="search" type="search" aria-label="Search products, brands and more" placeholder="Search for products, brands and more..." className="h-[48px] w-full rounded-full border-[#E5E7EB] bg-[#F9FAFB] px-5 pr-14 text-[14px] font-normal text-[#334155] outline-none placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:bg-white focus-visible:ring-0" />
            <button type="submit" aria-label="Search" className="absolute right-[4px] top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-[#16A34A] text-white transition-colors hover:bg-[#15803D]">
              <Search size={19} strokeWidth={2} />
            </button>
          </div>
        </form>

        <NavigationMenu className="hidden shrink-0 lg:flex">
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link href="/" />} className="h-9 rounded-lg bg-transparent px-2.5 py-2 text-[15px] font-normal text-[#172033] transition-all hover:bg-[#F0FDF4] hover:text-[#16A34A] focus:bg-[#F0FDF4] focus:text-[#16A34A]">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link href="/products" />} className="h-9 rounded-lg bg-transparent px-2.5 py-2 text-[15px] font-normal text-[#172033] transition-all hover:bg-[#F0FDF4] hover:text-[#16A34A] focus:bg-[#F0FDF4] focus:text-[#16A34A]">Shop</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-9 rounded-lg bg-transparent px-2.5 py-2 text-[15px] font-normal text-[#172033] transition-all hover:bg-[#F0FDF4] hover:text-[#16A34A] focus:bg-[#F0FDF4] focus:text-[#16A34A] data-popup-open:bg-[#F0FDF4] data-open:bg-[#F0FDF4] data-popup-open:text-[#16A34A] data-open:text-[#16A34A]">Categories</NavigationMenuTrigger>
              <NavigationMenuContent className="w-[250px] rounded-2xl border border-slate-100 bg-white p-0 shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                <ul className="w-[250px] overflow-hidden rounded-2xl bg-white py-2">
                  {categoryMenuItems.map((category) => (
                    <li key={category.title}>
                      <NavigationMenuLink render={<Link href={category.href} />} className="flex h-[54px] w-full items-center rounded-none bg-white px-5 py-0 text-[18px] font-normal text-[#475569] transition-colors hover:bg-[#F0FDF4] hover:text-[#16A34A] focus:bg-[#F0FDF4] focus:text-[#16A34A]">{category.title}</NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link href="/brands" />} className="h-9 rounded-lg bg-transparent px-2.5 py-2 text-[15px] font-normal text-[#172033] transition-all hover:bg-[#F0FDF4] hover:text-[#16A34A] focus:bg-[#F0FDF4] focus:text-[#16A34A]">Brands</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex shrink-0 items-center">
          <div className="mr-3 hidden items-center gap-2.5 border-r border-[#E5E7EB] pr-3 lg:flex">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#F0FDF4]"><Headphones size={20} strokeWidth={2} className="text-[#16A34A]" /></div>
            <div className="leading-tight"><p className="text-[11px] font-normal text-[#94A3B8]">Support</p><p className="text-[13px] font-normal text-[#334155]">24/7 Help</p></div>
          </div>
          <WishlistIconLink />
          <CartIconLink />
          {status === "authenticated" ? <ProfileMenu />
            :
            <Link href="/login" className="ml-1 hidden h-[44px] items-center gap-1.5 rounded-full bg-[#16A34A] px-5 text-[13px] font-normal text-white transition-colors hover:bg-[#15803D] lg:flex"><UserRound size={16} strokeWidth={1.8} /><span>Sign In</span></Link>

          }
        </div>
      </div>
    </header>
  );
}
