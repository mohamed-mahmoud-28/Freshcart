"use client"

export default function ProductError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-[55vh] place-items-center px-4 py-12"><section className="text-center"><h1 className="text-xl font-bold text-slate-900">Could not load this product</h1><p className="mt-2 text-sm text-slate-500">{error.message || 'Please try again in a moment.'}</p><button type="button" onClick={() => reset()} className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">Try again</button></section></main>
}
