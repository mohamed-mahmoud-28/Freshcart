'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import AccountSidebar from '@/_components/Account/AccountSidebar'
import AccountHeader from '@/_components/Account/AccountHeader'

type Address = { _id: string; name?: string; details?: string; city?: string; phone?: string }
const inputClass = 'mt-1.5 h-11 w-full rounded-lg border border-[#dfe5e9] bg-white px-3 text-sm text-[#263247] outline-none transition focus:border-[#12a857] focus:ring-2 focus:ring-[#12a857]/10'

export default function AddressesPage({ initialAddresses, initialError = '' }: { initialAddresses: Address[]; initialError?: string }) {
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addresses, setAddresses] = useState(initialAddresses)
  const loadError = initialError
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    setNotice('')
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/addresses', {
        method: editingAddress ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(form.get('name')),
          details: String(form.get('details')),
          city: String(form.get('city')),
          phone: String(form.get('phone')),
          ...(editingAddress ? { addressId: editingAddress._id } : {}),
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.message || 'Could not save this address.')
      const returnedAddresses = Array.isArray(payload?.data) ? payload.data as Address[] : null
      const savedAddress = payload?.data && !Array.isArray(payload.data) && typeof payload.data._id === 'string' ? payload.data as Address : null
      if (returnedAddresses) setAddresses(returnedAddresses)
      else if (savedAddress) setAddresses(current => editingAddress
        ? current.map(address => address._id === editingAddress._id ? savedAddress : address)
        : [savedAddress, ...current])
      setIsFormOpen(false)
      setNotice(editingAddress ? 'Address updated successfully.' : 'Address added successfully.')
      setEditingAddress(null)
      if (!returnedAddresses && !savedAddress) router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save this address.')
    } finally {
      setIsSaving(false)
    }
  }

  function openNewAddressForm() {
    setEditingAddress(null)
    setIsFormOpen(open => !open)
    setError('')
    setNotice('')
  }

  function openEditAddressForm(address: Address) {
    setEditingAddress(address)
    setIsFormOpen(true)
    setError('')
    setNotice('')
  }

  async function deleteAddress(id: string) {
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/addresses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId: id }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.message || 'Could not delete this address.')
      setAddresses(current => current.filter(address => address._id !== id))
      setNotice('Address deleted successfully.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete this address.')
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#f7f9f8] text-[#263247]">
      <AccountHeader />
      <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-9 lg:px-8 lg:py-10">
        <AccountSidebar active="addresses" />
        <section className="min-w-0">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Addresses</h1>
              <p className="mt-1.5 text-sm text-[#758094]">Manage your saved delivery addresses</p>
            </div>
            <button type="button" onClick={openNewAddressForm} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#12a857] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d9149]">
              <Plus size={17}/>{isFormOpen ? 'Close form' : 'Add Address'}
            </button>
          </header>

          {error && <p role="alert" className="mb-5 rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">{error}</p>}
          {notice && <p role="status" className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 p-3.5 text-sm text-emerald-700">{notice}</p>}

          {isFormOpen && (
            <form key={editingAddress?._id ?? 'new-address'} onSubmit={saveAddress} className="mb-5 rounded-2xl border border-[#e4e9ed] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-lg font-semibold">{editingAddress ? 'Edit address' : 'Add a new address'}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#596579]">Address name<input className={inputClass} name="name" placeholder="Home" required minLength={2} defaultValue={editingAddress?.name ?? ''}/></label>
                <label className="text-sm font-medium text-[#596579]">City<input className={inputClass} name="city" placeholder="Cairo" required defaultValue={editingAddress?.city ?? ''}/></label>
                <label className="text-sm font-medium text-[#596579] sm:col-span-2">Street address<input className={inputClass} name="details" placeholder="Street, building, apartment" required minLength={3} defaultValue={editingAddress?.details ?? ''}/></label>
                <label className="text-sm font-medium text-[#596579]">Phone number<input className={inputClass} name="phone" type="tel" placeholder="01xxxxxxxxx" required pattern="[0-9+() -]{7,20}" defaultValue={editingAddress?.phone ?? ''}/></label>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button disabled={isSaving} className="h-11 rounded-lg bg-[#12a857] px-5 text-sm font-semibold text-white hover:bg-[#0d9149] disabled:opacity-60">{isSaving ? 'Saving…' : editingAddress ? 'Save Changes' : 'Save Address'}</button>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingAddress(null) }} className="h-11 rounded-lg border border-[#dfe5e9] px-5 text-sm font-medium text-[#596579] hover:bg-slate-50">Cancel</button>
              </div>
            </form>
          )}

          {loadError ? (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center"><p className="text-sm text-red-700">{loadError}</p><button type="button" onClick={() => router.refresh()} className="mt-4 rounded-lg border border-[#dfe5e9] px-4 py-2 text-sm font-medium hover:bg-slate-50">Try again</button></div>
          ) : addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#d6e2da] bg-white px-6 py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-xl bg-[#e9f8ef] text-[#12a857]"><MapPin size={21}/></span><h2 className="mt-4 text-lg font-semibold">No saved addresses</h2><p className="mt-1 text-sm text-[#758094]">Add an address to make checkout faster.</p></div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {addresses.map(address => (
                <article key={address._id} className="rounded-2xl border border-[#e4e9ed] bg-white p-5 shadow-sm transition hover:border-[#cfe8d8] hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-[#e9f8ef] text-[#12a857]"><MapPin size={19}/></span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEditAddressForm(address)} title="Edit address" aria-label={`Edit ${address.name || 'saved'} address`} className="grid size-9 place-items-center rounded-lg bg-[#f3f5f7] text-[#788497] transition hover:bg-emerald-50 hover:text-[#118a46]"><Pencil size={15}/></button>
                      <button type="button" onClick={() => void deleteAddress(address._id)} aria-label={`Delete ${address.name || 'saved'} address`} className="grid size-9 place-items-center rounded-lg bg-[#f3f5f7] text-[#788497] transition hover:bg-red-50 hover:text-red-600"><Trash2 size={15}/></button>
                    </div>
                  </div>
                  <h2 className="mt-4 truncate text-base font-bold text-[#263247]">{address.name || address.city || 'Saved Address'}</h2>
                  <p className="mt-1 text-sm text-[#596579]">{address.city}</p>
                  <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-[#758094]">{address.details}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#edf0f2] pt-3 text-xs text-[#758094]">
                    <span className="inline-flex items-center gap-1.5"><Phone size={13}/>{address.phone || 'No phone number'}</span>
                    <span className="inline-flex items-center gap-1.5"><Building2 size={13}/>{address.city}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
