import type { Category } from '@/interfaces/category'
import NavbarShellClient from './NavbarShellClient'

export default function NavbarShell({ categories }: { categories: Category[] }) {
  return <NavbarShellClient categories={categories} />
}
