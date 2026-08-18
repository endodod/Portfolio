"use client";
import { useEffect, useState } from "react";
import Console from "@/components/Console";
import DesktopWindow from "@/components/DesktopWindow";
import ProjectModal from "@/components/ProjectModal";
import useIsDesktop from "@/hooks/useIsDesktop";
import useWindowStack from "@/hooks/useWindowStack";
import { projects } from "@/content/projects";

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
];

const FEATURED_PROJECTS = ["Portfolio", "PortfolioAnalyzer", "Floored", "BlackJack"];

const WINDOW_IDS = ["proj-pkg", "projects", "console"];
const DEFAULT_POS = {
  "proj-pkg": { x: -160, y: 508, width: 320, height: 178 },
  projects: { x: 40, y: 70, width: 900, height: 589 },
  console: { x: 130, y: 679, width: 720, height: 215 },
};

export default function ProjectsPage() {
  const isDesktop = useIsDesktop();
  const { zIndexOf, focus } = useWindowStack(WINDOW_IDS);
  const [activeProject, setActiveProject] = useState(null);

  const labelOrder = { "live": 0, "self host": 1, "coming soon": 2 };
  const sortedProjects = projects
    .filter((p) => FEATURED_PROJECTS.includes(p.name))
    .sort((a, b) => {
      const aOrder = labelOrder[a.label] ?? 999;
      const bOrder = labelOrder[b.label] ?? 999;
      return aOrder - bOrder;
    });

  useEffect(() => {
    if (window.innerWidth < 768) window.scrollTo(0, 0);
  }, []);

  const PROJECT_FILES = Object.fromEntries(
    sortedProjects.map((p) => {
      const filename = p.dir.replace(/\/$/, "") + ".txt";
      const content = [
        p.name,
        p.label ? `status: ${p.label}` : null,
        "",
        p.description,
        ...(p.highlights ? ["", ...p.highlights.map((h) => `- ${h}`)] : []),
      ].filter((line) => line !== null).join("\n");
      return [filename, { content, open: () => setActiveProject(p) }];
    })
  );

  return (
    <>
      <main className="home home--fixed console">
        <div className="home-shell home-shell--stack">

          <p className="proj-github-note proj-github-note--top">
            All of my projects are available on my{" "}
            <a href="https://github.com/endodod" target="_blank" rel="noopener noreferrer">
              GitHub page
            </a>.
          </p>

          {isDesktop && (
            <DesktopWindow defaultPos={DEFAULT_POS["proj-pkg"]} zIndex={zIndexOf("proj-pkg")} onFocus={() => focus("proj-pkg")}>
              <section className="desktop-window desktop-window--proj-pkg">
                <div className="desktop-header window-drag-handle">
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
            </DesktopWindow>
          )}

          <DesktopWindow active={isDesktop} defaultPos={DEFAULT_POS.projects} zIndex={zIndexOf("projects")} onFocus={() => focus("projects")} minWidth={480} minHeight={320}>
          <section className={`projects-window${isDesktop ? " projects-window--rnd" : ""}`} aria-label="My projects — directory listing">
            <div className={`console-header${isDesktop ? " window-drag-handle" : ""}`}>
              <span className="console-dot console-dot--red" />
              <span className="console-dot console-dot--yellow" />
              <span className="console-dot console-dot--green" />
              <span className="console-title">ls -la my-projects/ — paul @ portfolio</span>
            </div>

            <div className="projects-body">
              <div className="proj-grid">
                {sortedProjects.map((p) => (
                  <button
                    key={p.name}
                    className="proj-entry"
                    onClick={() => setActiveProject(p)}
                    aria-label={`Open ${p.dir} details`}
                  >
                    <div className="proj-entry-mobile">
                      <span className="proj-icon" aria-hidden="true">{p.icon}</span>
                      <span className="proj-name">{p.name}</span>
                    </div>
                    <div className="proj-entry-desktop">
                      <div className="proj-entry-header">
                        <span className="proj-dir">drwxr-xr-x</span>
                        <span className="proj-name about-value--accent">{p.dir}</span>
                        {p.label && <span className={`proj-label proj-label--${p.label.replace(/\s+/g, '-')}`}>{p.label}</span>}
                      </div>
                      <p className="proj-entry-desc">{p.description}</p>
                      {p.highlights && (
                        <ul className="proj-entry-highlights">
                          {p.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <a
                href="https://github.com/endodod"
                target="_blank"
                rel="noopener noreferrer"
                className="proj-github-note--inline"
              >
                View all my projects on GitHub
              </a>
            </div>
          </section>
          </DesktopWindow>

          <Console
            quickCommands={QUICK_COMMANDS}
            autoRun={false}
            files={PROJECT_FILES}
            dirs={{}}
            draggable={isDesktop}
            defaultPos={DEFAULT_POS.console}
            zIndex={zIndexOf("console")}
            onFocus={() => focus("console")}
          />
        </div>
      </main>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
