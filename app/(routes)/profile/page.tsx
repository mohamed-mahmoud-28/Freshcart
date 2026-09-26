'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Save, ShieldCheck, UserRound } from 'lucide-react'
import AccountSidebar from '@/_components/Account/AccountSidebar'
import AccountHeader from '@/_components/Account/AccountHeader'

const inputClass = 'mt-1.5 h-11 w-full rounded-lg border border-[#dfe5e9] bg-white px-3 text-sm text-[#263247] outline-none transition focus:border-[#12a857] focus:ring-2 focus:ring-[#12a857]/10'

export default function Profile() {
  const { data, status, update } = useSession()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState<'profile' | 'password' | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy('profile')
    setError('')
    setNotice('')
    const form = new FormData(event.currentTarget)
    const profile = {
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
    }
    try {
      const response = await fetch('/api/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Could not save your profile.')
      await update({ user: profile })
      setNotice('Your profile information was saved.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save your profile.')
    } finally {
      setBusy(null)
    }
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy('password')
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, password, rePassword }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Could not change your password.')
      setCurrentPassword('')
      setPassword('')
      setRePassword('')
      setNotice('Your password was changed.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not change your password.')
    } finally {
      setBusy(null)
    }
  }

  if (status === 'loading') {
    return <main className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-4 py-10"><div className="h-10 w-56 rounded bg-slate-100"/><div className="mt-8 h-96 rounded-2xl bg-slate-100"/></main>
  }

  return (
    <main className="min-h-[70vh] bg-[#f7f9f8] text-[#263247]">
      <AccountHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-9">
          <AccountSidebar active="settings"/>
          <section className="min-w-0">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div><h2 className="text-2xl font-bold sm:text-3xl">Account Settings</h2><p className="mt-1.5 text-sm text-[#758094]">Update your personal details and password.</p></div>
              <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#118a46] hover:text-[#0c6d37]">View orders<ArrowRight size={15}/></Link>
            </div>

            {(error || notice) && <p role={error ? 'alert' : 'status'} className={`mb-5 rounded-lg border p-4 text-sm ${error ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>{error || notice}</p>}

            <form onSubmit={updateProfile} className="rounded-2xl border border-[#e4e9ed] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-[#edf0f2] pb-5">
                <span className="grid size-11 place-items-center rounded-xl bg-[#e9f8ef] text-[#12a857]"><UserRound size={20}/></span>
                <div><h3 className="text-lg font-bold">Profile Information</h3><p className="mt-0.5 text-sm text-[#758094]">Update your name, email and phone number.</p></div>
              </div>
              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#596579]">Full Name<input className={inputClass} name="name" required minLength={2} defaultValue={data?.user?.name ?? ''}/></label>
                <label className="text-sm font-medium text-[#596579]">Email Address<input className={inputClass} name="email" type="email" required defaultValue={data?.user?.email ?? ''}/></label>
                <label className="text-sm font-medium text-[#596579] sm:col-span-2">Phone Number<input className={inputClass} name="phone" type="tel" required pattern="[0-9+() -]{7,20}" defaultValue={data?.user?.phone ?? ''} placeholder="01xxxxxxxxx"/></label>
              </div>
              <button disabled={busy !== null} className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#12a857] px-5 text-sm font-semibold text-white transition hover:bg-[#0d9149] disabled:cursor-wait disabled:opacity-60"><Save size={16}/>{busy === 'profile' ? 'Saving…' : 'Save Changes'}</button>
            </form>

            <form onSubmit={changePassword} className="mt-5 rounded-2xl border border-[#e4e9ed] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 border-b border-[#edf0f2] pb-5">
                <span className="grid size-11 place-items-center rounded-xl bg-[#fff5e6] text-[#d48600]"><LockKeyhole size={20}/></span>
                <div><h3 className="text-lg font-bold">Change Password</h3><p className="mt-0.5 text-sm text-[#758094]">Choose a password that is at least 6 characters long.</p></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} visible={showCurrent} onToggle={() => setShowCurrent(value => !value)} autoComplete="current-password"/>
                <span className="hidden sm:block" aria-hidden="true"/>
                <PasswordField label="New Password" value={password} onChange={setPassword} visible={showPassword} onToggle={() => setShowPassword(value => !value)} autoComplete="new-password" minLength={6}/>
                <PasswordField label="Confirm New Password" value={rePassword} onChange={setRePassword} visible={showConfirm} onToggle={() => setShowConfirm(value => !value)} autoComplete="new-password" minLength={6}/>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-[#758094]"><ShieldCheck size={15} className="text-[#12a857]"/>Your password is sent securely to your account service.</div>
              <button disabled={busy !== null} className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#e88700] px-5 text-sm font-semibold text-white transition hover:bg-[#c97300] disabled:cursor-wait disabled:opacity-60"><LockKeyhole size={16}/>{busy === 'password' ? 'Changing…' : 'Change Password'}</button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

function PasswordField({ label, value, onChange, visible, onToggle, autoComplete, minLength }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void; autoComplete: string; minLength?: number }) {
  return (
    <label className="block text-sm font-medium text-[#596579]">{label}
      <span className="relative mt-1.5 block">
        <input className={`${inputClass} pr-11`} type={visible ? 'text' : 'password'} autoComplete={autoComplete} minLength={minLength} required value={value} onChange={event => onChange(event.target.value)}/>
        <button type="button" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={onToggle} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#98a2b3] hover:text-[#118a46]">{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
      </span>
    </label>
  )
}
