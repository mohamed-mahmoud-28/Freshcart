import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Authoption from '@/next-auth/auth/authoption'
import ProfileClient from '@/_components/Account/ProfileClient'

export default async function ProfileRoute() {
  const session = await getServerSession(Authoption)
  if (!session) redirect('/login?callbackUrl=/profile')
  return <ProfileClient initialUser={{ name: session.user?.name ?? '', email: session.user?.email ?? '', phone: session.user?.phone ?? '' }} />
}
