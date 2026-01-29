import Link from "next/link";

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#050509] text-white">
      {/* Minimal icon navigation */}
      <header className="fixed top-0 right-0 z-50 w-full px-6 py-4">
        <div className="mx-auto flex max-w-6xl justify-end">
          <nav className="flex flex-col items-center gap-2 rounded-full border border-zinc-800 bg-black/70 px-3 py-3 text-zinc-400 backdrop-blur">
            <Link
              href="/"
              aria-label="Home"
              className="rounded-full p-2.5 hover:text-[#81F4E1] hover:bg-zinc-900 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5.5 10.5V20h13v-9.5" />
              </svg>
            </Link>
            <Link
              href="/projects"
              aria-label="Projects"
              className="rounded-full p-2.5 hover:text-[#81F4E1] hover:bg-zinc-900 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
                <rect x="13.5" y="4" width="7" height="7" rx="1.5" />
                <rect x="3.5" y="13" width="7" height="7" rx="1.5" />
                <rect x="13.5" y="13" width="7" height="7" rx="1.5" />
              </svg>
            </Link>
            <Link
              href="/blog"
              aria-label="Blog"
              className="rounded-full p-2.5 hover:text-[#81F4E1] hover:bg-zinc-900 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="5" y="4" width="14" height="16" rx="2" />
                <path d="M8 8.5h8" />
                <path d="M8 12h5.5" />
                <path d="M8 15.5h4" />
              </svg>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto min-h-[60vh] max-w-4xl px-6 pb-24 pt-32 text-white">
        <section className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Blog
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Notes on process, craft & the web.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-zinc-400 md:text-base">
              Longer form thoughts on creative development, design systems and
              building expressive digital products. Proper posts coming soon.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 p-6 text-sm text-zinc-500">
            Stay tuned — I&apos;m currently collecting drafts, experiments and
            behind‑the‑scenes breakdowns to share here.
          </div>
        </section>
      </main>
    </div>
  );
}


