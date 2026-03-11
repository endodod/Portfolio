"use client";
import Console from "@/components/Console";
import { projects } from "@/content/projects";

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
  { label: "About Me", command: "cat about-me.txt" },
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
        <section className="desktop-window desktop-window--proj-langs" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">languages.json</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">{"{"}</span>
              <span className="desktop-line">{"  \"Python\":     ████░░  42%,"}</span>
              <span className="desktop-line">{"  \"JavaScript\": ███░░░  33%,"}</span>
              <span className="desktop-line">{"  \"CSS\":         ██░░░░  16%,"}</span>
              <span className="desktop-line">{"  \"HTML\":        █░░░░░   9%"}</span>
              <span className="desktop-line text-green">{"}"}</span>
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--proj-stats" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">stats.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">● repos         3</span>
              <span className="desktop-line">● languages     4</span>
              <span className="desktop-line">● frameworks    5</span>
              <span className="desktop-line">● deployments   1</span>
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--proj-git" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">git log --oneline</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">f3a91c2 add docker support</span>
              <span className="desktop-line">b71e084 fix card deal logic</span>
              <span className="desktop-line">c290d17 init portfolio v2</span>
              <span className="desktop-line">9d4e531 add yfinance API</span>
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
