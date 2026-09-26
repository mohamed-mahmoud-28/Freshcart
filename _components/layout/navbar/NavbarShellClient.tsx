'use client'

import { useEffect, useState } from 'react'
import type { Category } from '@/interfaces/category'
import DesktopNavbar from './desktop/DesktopNavbar'
import DesktopTopNav from './desktop/DesktopTopNav'
import MobileNavbar from './mobile/MobileNavbar'

export default function NavbarShellClient({ categories }: { categories: Category[] }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div><div className="hidden lg:block"><DesktopTopNav isScrolled={isScrolled} /><DesktopNavbar isScrolled={isScrolled} categories={categories} /></div><MobileNavbar /></div>
}
