"use client";
import { useEffect, useState } from "react";
import Console from "@/components/Console";
import ProjectModal from "@/components/ProjectModal";
import { projects } from "@/content/projects";

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
];

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (window.innerWidth < 768) window.scrollTo(0, 0);
  }, []);

  const PROJECT_FILES = Object.fromEntries(
    projects.map((p) => {
      const filename = p.dir.replace(/\/$/, "") + ".txt";
      return [filename, { text: `opening ${p.dir}...`, redirect: () => setActiveProject(p) }];
    })
  );

  return (
    <>
      <main className="home home--fixed console">
        <div className="home-shell home-shell--stack">

          <section className="desktop-window desktop-window--proj-pkg" aria-hidden="true">
            <div className="desktop-header">
              <span className="desktop-title">requirements.txt</span>
            </div>
            <div className="desktop-body">
              <pre>
                <span className="desktop-line text-green">Flask==3.1.1</span>
                <span className="desktop-line">Flask-Login==0.6.3</span>
                <span className="desktop-line">Flask-WTF==1.2.1</span>
                <span className="desktop-line">Werkzeug==3.1.3</span>
                <span className="desktop-line">mysql-connector-python==8.1.0</span>
                <span className="desktop-line">yfinance==0.2.65</span>
                <span className="desktop-line">python-dotenv==1.1.1</span>
                <span className="desktop-line">gunicorn==21.2.0</span>
              </pre>
            </div>
          </section>

          <section className="projects-window" aria-label="My projects — directory listing">
            <div className="console-header">
              <span className="console-dot console-dot--red" />
              <span className="console-dot console-dot--yellow" />
              <span className="console-dot console-dot--green" />
              <span className="console-title">ls -la my-projects/ — paul @ portfolio</span>
            </div>

            <div className="projects-body">
              <div className="proj-grid">
                {projects.map((p) => (
                  <button
                    key={p.name}
                    className="proj-entry"
                    onClick={() => setActiveProject(p)}
                    aria-label={`Open ${p.name} details`}
                  >
                    <span className="proj-icon" aria-hidden="true">{p.icon}</span>
                    <span className="proj-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <Console quickCommands={QUICK_COMMANDS} autoRun={false} files={PROJECT_FILES} dirs={{}} />
        </div>
      </main>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
