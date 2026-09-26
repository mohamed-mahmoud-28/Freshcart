import Link from 'next/link'
import { BookUser, ChevronRight, Settings } from 'lucide-react'

export default function AccountSidebar({ active }: { active: 'addresses' | 'settings' }) {
  return (
    <aside className="h-fit rounded-2xl border border-[#e5e9ed] bg-white p-4 shadow-sm">
      <h2 className="px-2 pb-3 text-sm font-bold text-[#263247]">My Account</h2>
      <nav aria-label="Account navigation" className="grid gap-1">
        <Link href="/addresses" aria-current={active === 'addresses' ? 'page' : undefined} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${active === 'addresses' ? 'bg-[#e9f8ef] font-semibold text-[#118a46]' : 'text-[#596579] hover:bg-slate-50'}`}>
          <BookUser size={17}/><span className="flex-1">My Addresses</span><ChevronRight size={15}/>
        </Link>
        <Link href="/profile" aria-current={active === 'settings' ? 'page' : undefined} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition ${active === 'settings' ? 'bg-[#e9f8ef] font-semibold text-[#118a46]' : 'text-[#596579] hover:bg-slate-50'}`}>
          <Settings size={17}/><span className="flex-1">Settings</span><ChevronRight size={15}/>
        </Link>
      </nav>
    </aside>
  )
}
