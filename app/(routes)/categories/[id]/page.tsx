import { CategoryDetailPage } from '@/_components/Shop/CategoryPages'

export default async function CategoryRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CategoryDetailPage id={id} />
}
