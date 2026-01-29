import Link from "next/link";

export default function Projects() {
  const projectsList = [
    {
      id: 1,
      title: "Project One",
      description: "Description here",
      category: "Category",
      color: "from-purple-500 to-pink-500",
      year: 2024,
    },
    {
      id: 2,
      title: "Project Two",
      description: "Description here",
      category: "Category",
      color: "from-blue-500 to-cyan-500",
      year: 2024,
    },
    {
      id: 3,
      title: "Project Three",
      description: "Description here",
      category: "Category",
      color: "from-orange-500 to-red-500",
      year: 2024,
    },
    {
      id: 4,
      title: "Project Four",
      description: "Description here",
      category: "Category",
      color: "from-green-500 to-emerald-500",
      year: 2024,
    },
  ];

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

      {/* Main Content */}
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-20">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">Projects</h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              A collection of work showcasing design and development.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {projectsList.map((project) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group"
              >
                <div className={`bg-gradient-to-br ${project.color} p-0.5 rounded-xl h-full`}>
                  <div className="bg-black rounded-xl overflow-hidden h-full flex flex-col justify-between group-hover:bg-gray-950 transition">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center">
                      <p className="text-gray-400">Image</p>
                    </div>
                    <div className="p-8">
                      <p className="text-sm text-gray-400 mb-2">{project.category}</p>
                      <h2 className="text-3xl font-bold mb-2 group-hover:text-cyan-400 transition">
                        {project.title}
                      </h2>
                      <p className="text-gray-400 mb-6">{project.description}</p>
                      <div className="text-cyan-400 font-semibold flex items-center gap-1">
                        View Project →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Let's create something amazing together.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition">
              Get in Touch
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center text-gray-400">
          <p>© 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
