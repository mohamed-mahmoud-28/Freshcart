import { CategorySubcategoriesPage } from '@/_components/Shop/CategoryPages'

export default async function CategorySubcategoriesRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CategorySubcategoriesPage id={id} />
}
