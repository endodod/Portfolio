"use client";
import { useEffect, useState } from "react";
import Console from "@/components/Console";
import ProjectModal from "@/components/ProjectModal";
import { projects } from "@/content/projects";
import { alignList } from "@/lib/alignList";

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
];

const PROJECT_SECTIONS = [
  { category: "personal", title: "Personal Projects" },
  { category: "hackathon", title: "Hackathon Projects" },
  { category: "school", title: "School Projects" },
];

export default function ProjectsPage() {
  const [activeProject, setActiveProject] = useState(null);
  const [topProjects, setTopProjects] = useState(["loading..."]);

  useEffect(() => {
    fetch("/api/github-top-projects")
      .then((r) => r.json())
      .then((d) => setTopProjects(d.error ? ["(unavailable)"] : alignList(d.projects, (p) => `${p.commits} commits`)))
      .catch(() => setTopProjects(["(unavailable)"]));
  }, []);

  const labelOrder = { "live": 0, "self host": 1, "coming soon": 2 };
  const sortByLabel = (list) =>
    [...list].sort((a, b) => {
      const aOrder = labelOrder[a.label] ?? 999;
      const bOrder = labelOrder[b.label] ?? 999;
      return aOrder - bOrder;
    });

  const sections = PROJECT_SECTIONS.map((section) => ({
    ...section,
    projects: sortByLabel(projects.filter((p) => p.category === section.category)),
  })).filter((section) => section.projects.length > 0);

  useEffect(() => {
    if (window.innerWidth < 768) window.scrollTo(0, 0);
  }, []);

  const PROJECT_FILES = Object.fromEntries(
    sections.flatMap((section) =>
      section.projects.map((p) => {
        const filename = p.dir.replace(/\/$/, "") + ".txt";
        const content = [
          p.name,
          p.label ? `status: ${p.label}` : null,
          "",
          p.description,
        ].filter((line) => line !== null).join("\n");
        return [filename, { content, open: () => setActiveProject(p) }];
      })
    )
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

          <section className="desktop-window desktop-window--proj-commits" aria-hidden="true">
            <div className="desktop-header">
              <span className="desktop-title">shortlog.txt</span>
            </div>
            <div className="desktop-body">
              <pre>
                <span className="desktop-line text-green">## top projects by commits</span>
                <span className="desktop-line"> </span>
                {topProjects.map((line, i) => (
                  <span key={i} className="desktop-line">{i + 1}. {line}</span>
                ))}
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
              {sections.map((section) => (
                <div className="proj-section" key={section.category}>
                  <span className="proj-section-title">## {section.title.toLowerCase()}</span>
                  <div className="proj-grid">
                    {section.projects.map((p) => (
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
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
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

          <Console quickCommands={QUICK_COMMANDS} autoRun={false} files={PROJECT_FILES} dirs={{}} />
        </div>
      </main>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}
