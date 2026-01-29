import Link from "next/link";

export default function About() {
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

      {/* About: vollständiger Text */}
      <main className="pt-28 pb-24 md:pt-32">
        <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6">
          <section className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Über mich
            </h1>
            <div className="space-y-4 text-sm text-zinc-300 md:text-base">
              <p>
                Mein Name ist Paul Kühn, ich bin 18 Jahre alt und besuche die IMS Hottingen,
                wo ich mich aktuell im zweiten Ausbildungsjahr mit Schwerpunkt Informatik
                befinde.
              </p>
              <p>
                Mein Interesse an Informatik besteht seit meiner Kindheit. Besonders angesprochen
                haben mich dabei schon früh das logische Denken, das Arbeiten mit Zahlen und das
                Lösen komplexer Probleme, was sich auch in meinem Interesse an Mathematik
                widerspiegelt. Die Informatik bietet für mich genau diese Kombination:
                analytisches Denken, strukturierte Lösungsansätze und die Möglichkeit,
                funktionierende Systeme aufzubauen.
              </p>
              <p>
                Ich arbeite überwiegend selbstständig und setze mich gerne intensiv mit
                Problemstellungen auseinander, bis eine saubere und nachvollziehbare Lösung
                entsteht. Mein Fokus liegt dabei weniger auf kurzfristigen Ergebnissen, sondern
                auf einer soliden technischen Umsetzung, die langfristig erweiterbar ist.
              </p>
              <p>
                Langfristig möchte ich mich weiter in Richtung Backend-Entwicklung und
                Datenbanksysteme entwickeln und zunehmend komplexere Systeme entwerfen und
                umsetzen.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
              Was kann ich?
            </h2>
            <div className="space-y-4 text-sm text-zinc-300 md:text-base">
              <p>
                Ich habe bereits mit verschiedenen Technologien im Rahmen von konkreten Projekten
                gearbeitet und diese praktisch eingesetzt.
              </p>
              <p>
                In meinem Projekt{" "}
                <Link
                  href="/projects/1"
                  className="text-zinc-100 underline underline-offset-4 hover:text-[#81F4E1]"
                >
                  PortfolioAnalyzer
                </Link>{" "}
                habe ich mit Python, Flask und MySQL gearbeitet. Der Schwerpunkt lag auf der
                Backend-Logik, der Datenverarbeitung sowie der strukturierten Anbindung einer
                Datenbank zur Analyse und Verwaltung von Portfolio-Daten. Für die
                Benutzeroberfläche wurde Bootstrap&nbsp;5 eingesetzt, ergänzt durch
                grundlegendes JavaScript für interaktive Elemente wie Diagramme und
                dynamische Inhalte.
              </p>
              <p>
                Im Projekt{" "}
                <Link
                  href="/projects/2"
                  className="text-zinc-100 underline underline-offset-4 hover:text-[#81F4E1]"
                >
                  IMSGrades
                </Link>{" "}
                habe ich eine Anwendung zur Verwaltung und Auswertung von Schulnoten
                umgesetzt. Dabei lag der Fokus auf Python, logischer Datenverarbeitung und
                einer klaren, strukturierten Umsetzung der Geschäftslogik.
              </p>
              <p>
                Beim Projekt{" "}
                <Link
                  href="/projects/3"
                  className="text-zinc-100 underline underline-offset-4 hover:text-[#81F4E1]"
                >
                  Prwr-good
                </Link>{" "}
                arbeitete ich an einem Frontend-Projekt mit React und TypeScript, wobei
                Tailwind CSS für das Styling verwendet wurde. Der Fokus lag hier auf dem
                komponentenbasierten Aufbau, einer sauberen Strukturierung des Codes und der
                Trennung von Logik und Darstellung.
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-zinc-100">
                  Durch diese Projekte habe ich praktische Erfahrung gesammelt in:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
                  <li>Backend-Entwicklung mit Python und Flask</li>
                  <li>Datenbankdesign und Datenabfragen mit MySQL</li>
                  <li>Frontend-Grundlagen mit HTML, Bootstrap und JavaScript</li>
                  <li>Moderne Frontend-Entwicklung mit React, TypeScript und Tailwind CSS</li>
                  <li>Aufbau strukturierter und logisch nachvollziehbarer Systeme</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024. All rights reserved.</p>
            <div className="flex gap-6 mt-6 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
