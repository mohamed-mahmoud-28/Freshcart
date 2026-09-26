export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[#fbfcfd] px-3 pt-6 pb-16 sm:px-4">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-5 h-3.5 w-[260px] animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
          <div className="h-[min(78vw,390px)] animate-pulse rounded-[10px] bg-slate-200 lg:h-[410px]" />
          <div className="grid h-[360px] animate-pulse content-start gap-3.5 rounded-[10px] bg-slate-100 p-[18px] sm:p-[26px] lg:h-[410px]">
            <div className="h-7 w-[35%] rounded bg-slate-200" />
            <div className="h-[55px] w-[85%] rounded bg-slate-200" />
            <div className="h-7 w-[45%] rounded bg-slate-200" />
            <div className="h-[60px] w-[90%] rounded bg-slate-200" />
            <div className="h-[45px] w-full rounded bg-slate-200" />
            <div className="h-7 w-[70%] rounded bg-slate-200" />
          </div>
        </div>
        <div className="mt-6 h-[210px] animate-pulse rounded-[10px] bg-slate-200" />
      </div>
    </main>
  );
}
