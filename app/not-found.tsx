'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, House } from 'lucide-react'

const destinations = [
  { label: 'All Products', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/brands' },
]

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100svh-7rem)] items-center justify-center overflow-hidden bg-[#f8fafb] px-4 py-12 text-center text-[#192334] sm:px-6 sm:py-16">
      <span aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-[#e9fbf0] blur-3xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-20 size-80 rounded-full bg-[#edfaf3] blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="relative w-full max-w-[536px]">
          <Image
            src="/Assets/images/error.svg"
            alt="Shopping cart illustration for a page that could not be found"
            width={536}
            height={333}
            priority
            className="h-auto w-full drop-shadow-sm"
          />
        </div>

        <div className="-mt-1 sm:-mt-3">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Oops! Nothing Here</h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#707b8d] sm:text-lg sm:leading-8">
            Looks like this page went out of stock. Don&apos;t worry, there&apos;s plenty more fresh content to explore.
          </p>
        </div>

        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:gap-4">
          <Link href="/" className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#13a653] px-7 text-base font-bold text-white shadow-lg shadow-green-700/15 transition hover:bg-[#0e9146] sm:px-8 sm:text-lg">
            <House size={20} fill="currentColor" />Go to Homepage
          </Link>
          <button type="button" onClick={() => window.history.back()} className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#e0e5e9] bg-white px-7 text-base font-bold text-[#3c4658] shadow-sm transition hover:bg-slate-50 sm:px-8 sm:text-lg">
            <ArrowLeft size={21} />Go Back
          </button>
        </div>

        <nav aria-label="Popular destinations" className="mt-9 w-full max-w-2xl rounded-3xl border border-[#edf0f2] bg-white px-4 py-5 shadow-sm sm:mt-11 sm:px-8 sm:py-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#9aa4b3] sm:text-sm">Popular Destinations</p>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {destinations.map(destination => (
              <Link key={destination.href} href={destination.href} className="rounded-xl bg-[#f3f5f7] px-4 py-2.5 text-sm font-semibold text-[#475366] transition hover:bg-[#eaf8ef] hover:text-[#118a46] sm:px-5">
                {destination.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </section>
  )
}
