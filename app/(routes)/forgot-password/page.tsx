'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

type Step = 'email' | 'code' | 'password'
const inputClass = 'mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function send(stepName: Step) {
    setBusy(true); setError(''); setNotice('')
    const body = stepName === 'email' ? { step: 'forgot', email } : stepName === 'code' ? { step: 'verify', resetCode: code } : { step: 'reset', email, newPassword: password }
    try {
      const response = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Could not update your password.')
      if (stepName === 'email') { setStep('code'); setNotice('A verification code has been sent to your email.') }
      else if (stepName === 'code') { setStep('password'); setNotice('Code verified. Create a new password.') }
      else router.push('/login?reset=success')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.') }
    finally { setBusy(false) }
  }

  const titles = { email: 'Forgot Password?', code: 'Check Your Email', password: 'Create New Password' }
  const descriptions = { email: "No worries, we'll send you a reset code", code: `Enter the verification code sent to ${email}`, password: 'Choose a strong password you have not used before' }

  return <main className="min-h-[calc(100vh-106px)] bg-[#fbfdfc] px-4 py-10 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2"><section className="hidden lg:block"><div className="grid h-72 place-items-center rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-100"><div className="grid size-24 place-items-center rounded-3xl bg-white text-emerald-600 shadow-lg"><LockKeyhole size={43}/></div></div><h2 className="mt-5 text-center text-2xl font-bold text-slate-800">Reset Your Password</h2><p className="mt-2 text-center text-sm text-slate-500">Email verification <span className="px-2 text-emerald-600">•</span> Secure reset <span className="px-2 text-emerald-600">•</span> Encrypted</p></section><section className="rounded-2xl bg-white p-6 shadow-[0_12px_32px_rgba(15,35,55,0.12)] sm:p-10"><p className="text-center text-xl font-bold"><span className="text-emerald-600">Fresh</span>Cart</p><h1 className="mt-3 text-center text-xl font-bold text-slate-800">{titles[step]}</h1><p className="mt-2 text-center text-sm text-slate-500">{descriptions[step]}</p><div className="my-7 flex items-center justify-center gap-2" aria-label={`Step ${step === 'email' ? 1 : step === 'code' ? 2 : 3} of 3`}>{(['email','code','password'] as Step[]).map((item,index) => { const active = item === step; const complete = ['email','code','password'].indexOf(step) > index; const Icon = index === 0 ? Mail : index === 1 ? KeyRound : LockKeyhole; return <span key={item} className={`grid size-9 place-items-center rounded-full ${active || complete ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{complete ? <Check size={16}/> : <Icon size={15}/>}</span> })}</div>
      <form className="grid gap-4" onSubmit={event => { event.preventDefault(); if (step === 'email') void send('email'); else if (step === 'code') void send('code'); else if (password !== confirm) setError('Passwords do not match.'); else void send('password') }}>
        {step === 'email' && <label className="text-xs font-medium text-slate-700">Email Address<input className={inputClass} type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter your email address"/></label>}
        {step === 'code' && <label className="text-xs font-medium text-slate-700">Verification Code<input className={`${inputClass} text-center tracking-[0.5em]`} inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={event => setCode(event.target.value)} placeholder="••••••"/></label>}
        {step === 'password' && <><label className="text-xs font-medium text-slate-700">New Password<span className="relative mt-1.5 block"><input className={`${inputClass} pr-11`} type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={6} required value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter new password"/><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide new password' : 'Show new password'} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-emerald-700">{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span></label><label className="text-xs font-medium text-slate-700">Confirm Password<span className="relative mt-1.5 block"><input className={`${inputClass} pr-11`} type={showConfirm ? 'text' : 'password'} autoComplete="new-password" minLength={6} required value={confirm} onChange={event => setConfirm(event.target.value)} placeholder="Confirm new password"/><button type="button" onClick={() => setShowConfirm(value => !value)} aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-emerald-700">{showConfirm ? <EyeOff size={17}/> : <Eye size={17}/>}</button></span></label></>}
        {error && <p className="rounded-lg bg-red-50 p-3 text-xs text-red-600" role="alert">{error}</p>}{notice && <p className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700" role="status"><ShieldCheck className="mr-1 inline" size={14}/>{notice}</p>}
        <button disabled={busy} className="mt-1 h-11 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{busy ? 'Please wait…' : step === 'email' ? 'Send Reset Code' : step === 'code' ? 'Verify Code' : 'Reset Password'}</button>
      </form><div className="mt-5 flex justify-between text-xs"><Link href="/login" className="inline-flex items-center gap-1 text-emerald-700"><ArrowLeft size={14}/>Back to Sign In</Link>{step === 'code' && <button type="button" disabled={busy} onClick={() => void send('email')} className="text-emerald-700">Resend code</button>}{step === 'password' && <button type="button" onClick={() => setStep('code')} className="text-slate-500">Change code</button>}</div></section></div></main>
}
