export default function OrdersLoading() {
  return <main className="min-h-[70vh] bg-[#f7f9f8] px-4 py-8"><div className="mx-auto max-w-7xl"><div className="h-10 w-64 animate-pulse rounded bg-slate-100"/><div className="mt-8 grid gap-4">{[1, 2, 3].map(item => <div key={item} className="h-44 animate-pulse rounded-2xl border border-[#e4e9ed] bg-white" />)}</div></div></main>
}
