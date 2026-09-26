import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Authoption from '@/next-auth/auth/authoption'
import { getUserToken } from '@/utilities/Token'
import { getAddressesWithToken } from '@/API/Addresses/addressesApi'
import AddressesClient from '@/_components/Account/AddressesClient'

export default async function AddressesRoute() {
  const session = await getServerSession(Authoption)
  if (!session) redirect('/login?callbackUrl=/addresses')
  const token = await getUserToken()
  if (!token) redirect('/login?callbackUrl=/addresses')

  let initialAddresses: Awaited<ReturnType<typeof getAddressesWithToken>>['data'] = []
  let initialError = ''
  try { initialAddresses = (await getAddressesWithToken(token)).data ?? [] }
  catch (error) { initialError = error instanceof Error ? error.message : 'Could not load your addresses.' }
  return <AddressesClient key={JSON.stringify([initialAddresses, initialError])} initialAddresses={initialAddresses} initialError={initialError} />
}
