import Link from "next/link";

export default async function ProjectDetail({ params }) {
  const { id } = await params;

  const projects = {
    1: {
      title: "Project One",
      subtitle: "Project Subtitle",
      color: "from-purple-500 to-pink-500",
      role: "Role",
      duration: "Duration",
      year: 2024,
    },
    2: {
      title: "Project Two",
      subtitle: "Project Subtitle",
      color: "from-blue-500 to-cyan-500",
      role: "Role",
      duration: "Duration",
      year: 2024,
    },
    3: {
      title: "Project Three",
      subtitle: "Project Subtitle",
      color: "from-orange-500 to-red-500",
      role: "Role",
      duration: "Duration",
      year: 2024,
    },
  };

  const project = projects[id];

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <Link href="/projects" className="text-cyan-400 hover:underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            LOGO
          </Link>
          <nav className="flex gap-8 items-center">
            <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
            <Link href="/projects" className="hover:text-cyan-400 transition">Projects</Link>
          </nav>
        </div>
      </header>

      {/* Back Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <Link href="/projects" className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition border border-gray-700">
          ← Back
        </Link>
      </div>

      {/* Main Content */}
      <main className="pt-32">
        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${project.color} p-0.5`}>
          <div className="bg-black py-24">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <p className="text-cyan-400 text-sm font-semibold mb-4">PROJECT</p>
              <h1 className="text-6xl md:text-7xl font-bold mb-6">{project.title}</h1>
              <p className="text-xl text-gray-400">{project.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Project Image */}
        <div className="bg-gradient-to-b from-gray-900 to-black py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl h-96 flex items-center justify-center">
              <p className="text-gray-400">Project Image</p>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <div>
                <p className="text-gray-400 text-sm mb-2">ROLE</p>
                <p className="text-lg font-semibold">{project.role}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">DURATION</p>
                <p className="text-lg font-semibold">{project.duration}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">YEAR</p>
                <p className="text-lg font-semibold">{project.year}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">STATUS</p>
                <p className="text-lg font-semibold text-cyan-400">Completed</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA & Navigation */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition">
                Learn More
              </button>
              <Link href="/projects" className="px-8 py-4 border-2 border-cyan-500 rounded-lg font-semibold hover:bg-cyan-500/10 transition text-center">
                All Projects
              </Link>
            </div>

            {/* Next Project Navigation */}
            <div className="flex justify-between items-center pt-12 border-t border-gray-800">
              <Link href={`/projects/${parseInt(id) - 1 || 3}`} className="group hover:text-cyan-400 transition">
                <p className="text-gray-400 text-sm mb-2">← Previous</p>
                <p className="font-semibold">Previous Project</p>
              </Link>
              
              <Link href="/projects" className="text-center">
                <p className="text-gray-400 text-sm mb-2">All Projects</p>
                <p className="font-semibold">View Portfolio</p>
              </Link>

              <Link href={`/projects/${parseInt(id) + 1 > 3 ? 1 : parseInt(id) + 1}`} className="group hover:text-cyan-400 transition text-right">
                <p className="text-gray-400 text-sm mb-2">Next →</p>
                <p className="font-semibold">Next Project</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12">
        <div className="max-w-5xl mx-auto px-6 text-center text-gray-400">
          <p>© 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
