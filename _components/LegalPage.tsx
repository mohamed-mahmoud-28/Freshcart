import Link from 'next/link'

type LegalSection = { title: string; paragraphs: string[] }

export default function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10 text-[#263247] sm:px-6 sm:py-14">
      <Link href="/register" className="text-sm font-semibold text-[#118a46] hover:underline">← Back to create account</Link>
      <header className="mb-8 mt-6 border-b border-[#e7ece9] pb-6">
        <p className="text-sm font-semibold text-[#12a857]">FreshCart</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[#667386]">{intro}</p>
      </header>
      <div className="space-y-7">
        {sections.map(section => (
          <section key={section.title}>
            <h2 className="text-lg font-bold">{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph} className="mt-2 leading-7 text-[#667386]">{paragraph}</p>)}
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-xl bg-[#effaf3] p-4 text-sm leading-6 text-[#52665a]">Questions about this page? Contact <a className="font-semibold text-[#118a46] hover:underline" href="mailto:support@freshcart.com">support@freshcart.com</a>.</p>
    </article>
  )
}
