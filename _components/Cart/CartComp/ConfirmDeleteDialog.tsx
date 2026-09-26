'use client'

import { useEffect } from 'react'
import { LoaderCircle, Trash2 } from 'lucide-react'

type ConfirmDeleteDialogProps = {
  itemTitle?: string
  errorMessage?: string
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDeleteDialog({ itemTitle, errorMessage, isDeleting, onCancel, onConfirm }: ConfirmDeleteDialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isDeleting) onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDeleting, onCancel])

  const itemName = itemTitle ? <strong className="font-semibold text-slate-700">{itemTitle}</strong> : 'all items'

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/40 px-4 py-6"
      onPointerDown={(event) => { if (event.target === event.currentTarget && !isDeleting) onCancel() }}
    >
      <section
        aria-labelledby="cart-delete-title"
        aria-describedby="cart-delete-description"
        aria-modal="true"
        className="w-full max-w-[640px] rounded-md bg-white px-6 py-8 text-center shadow-2xl sm:px-10 sm:py-8"
        role="alertdialog"
      >
        <span className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-[#ffe4e6] text-[#f52336]">
          <Trash2 size={34} strokeWidth={2.3} />
        </span>
        <h2 className="text-[24px] font-bold text-[#172033] sm:text-[27px]" id="cart-delete-title">
          {itemTitle ? 'Remove item?' : 'Remove all items?'}
        </h2>
        <p className="mt-3 text-base text-[#758195] sm:text-lg" id="cart-delete-description">
          Remove {itemName} from your cart?
        </p>
        {errorMessage && <p className="mt-3 text-sm text-red-600" role="alert">{errorMessage}</p>}
        <div className="mt-10 flex justify-center gap-4">
          <button
            className="min-h-[60px] min-w-[120px] rounded-2xl bg-[#f1f2f4] px-6 text-lg font-medium text-[#172033] transition hover:bg-[#e5e7eb] disabled:opacity-60"
            autoFocus
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-[60px] min-w-[135px] items-center justify-center gap-2 rounded-2xl bg-[#f52336] px-6 text-lg font-semibold text-white transition hover:bg-[#dc1c2d] disabled:cursor-wait disabled:opacity-70"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting && <LoaderCircle className="animate-spin" size={19} />}
            {isDeleting ? 'Removing' : 'Remove'}
          </button>
        </div>
      </section>
    </div>
  )
}
