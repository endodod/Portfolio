"use client";
import Console from "@/components/Console";
import { projects } from "@/content/projects";

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
];

const PROJECT_FILES = Object.fromEntries(
  projects.map((p) => {
    const filename = p.dir.replace(/\/$/, "") + ".txt";
    return [filename, { text: `opening readme: ${p.github}#readme`, redirect: `${p.githubUrl}#readme` }];
  })
);

export default function ProjectsPage() {
  return (
    <main className="home home--fixed console">
      <div className="home-shell home-shell--stack">

        {/* Background decorative windows */}
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

        {/* Main projects window */}
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
              <div className="proj-entry" key={p.name}>
                <div className="proj-entry-header">
                  <span className="proj-dir">drwxr-xr-x</span>
                  <span className="proj-name about-value--accent">{p.dir}</span>
                </div>

                <div className="proj-fields">
                  <div className="about-field">
                    <span className="about-key">description</span>
                    <span className="about-sep">:</span>
                    <span className="about-value">{p.description}</span>
                  </div>
                  <div className="about-field">
                    <span className="about-key">stack</span>
                    <span className="about-sep">:</span>
                    <span className="about-value">
                      {p.stack.map((t) => (
                        <span className="about-tag" key={t}>{t}</span>
                      ))}
                    </span>
                  </div>
                  <div className="about-field">
                    <span className="about-key">github</span>
                    <span className="about-sep">:</span>
                    <a
                      className="about-value about-value--link"
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.github}
                    </a>
                  </div>
                  {p.live && (
                    <div className="about-field">
                      <span className="about-key">live</span>
                      <span className="about-sep">:</span>
                      <a
                        className="about-value about-value--link"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {p.live}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>

        <Console quickCommands={QUICK_COMMANDS} autoRun={false} files={PROJECT_FILES} dirs={{}} />
      </div>
    </main>
  );
}
