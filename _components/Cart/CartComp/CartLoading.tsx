export default function CartLoading() {
  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f7f8fa] px-4 py-8 md:px-8 md:py-10" aria-label="Loading cart">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-7 mt-8 h-14 w-60 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-[30px]">
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => <div className="h-36 animate-pulse rounded-xl bg-slate-200" key={item} />)}
          </div>
          <div className="min-h-[330px] animate-pulse rounded-xl bg-slate-200" />
        </div>
      </div>
    </main>
  )
}
