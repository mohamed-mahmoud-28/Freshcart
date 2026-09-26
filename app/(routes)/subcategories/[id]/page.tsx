import { SubcategoryDetailPage } from '@/_components/Shop/CategoryPages'

export default async function SubcategoryRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SubcategoryDetailPage id={id} />
}
