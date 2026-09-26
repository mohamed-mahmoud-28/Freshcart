import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Authoption from '@/next-auth/auth/authoption'
import { getUserToken } from '@/utilities/Token'
import { getOrdersWithToken } from '@/API/Orders/ordersApi'
import OrdersClient from '@/_components/Orders/OrdersClient'

export default async function OrdersRoute() {
  const session = await getServerSession(Authoption)
  if (!session?.user?.id) redirect('/login?callbackUrl=/orders')
  const token = await getUserToken()
  if (!token) redirect('/login?callbackUrl=/orders')

  let initialOrders: Awaited<ReturnType<typeof getOrdersWithToken>>['data'] = []
  let initialError = ''
  try {
    const payload = await getOrdersWithToken(token, session.user.id)
    initialOrders = Array.isArray(payload?.data) ? payload.data : []
  } catch (error) {
    initialError = error instanceof Error ? error.message : 'Could not load your orders.'
  }
  return <OrdersClient initialOrders={initialOrders} initialError={initialError} />
}
