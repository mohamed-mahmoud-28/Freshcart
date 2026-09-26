import Link from 'next/link'
import { UserRound } from 'lucide-react'

export default function AccountHeader() {
  return (
    <header className="bg-gradient-to-r from-[#16a34a] to-[#4ade80] px-4 py-7 text-white sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/85">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true">/</span>
          <span>My Account</span>
        </nav>
        <div className="mt-5 flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/20 shadow-sm sm:size-16">
            <UserRound size={28} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Account</h1>
            <p className="mt-1 text-sm text-white/90 sm:text-base">Manage your addresses and account settings</p>
          </div>
        </div>
      </div>
    </header>
  )
}
