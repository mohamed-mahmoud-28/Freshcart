import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MobileSearch() {
  return (
    <form action="/products" method="get" className="mb-4">
      <div className="relative">
        <Input name="search" type="search" aria-label="Search products" placeholder="Search products..." className="h-12 w-full rounded-xl border-[#E2E8F0] bg-[#F8FAFC] px-4 pr-13.75 text-[14px] text-[#334155] outline-none placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:bg-white focus-visible:ring-0" />
        <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-[#16A34A] text-white transition-colors hover:bg-[#15803D]"><Search size={18} strokeWidth={2} /></button>
      </div>
    </form>
  );
}
