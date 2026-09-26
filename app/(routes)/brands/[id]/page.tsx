import { BrandDetailPage } from '@/_components/Shop/BrandPages'

export default async function BrandRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BrandDetailPage id={id} />
}
