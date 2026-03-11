"use client";
import Console from "@/components/Console";
import { profile } from "@/content/profile";

const { name, role, location, school, contact, stack } = profile;

const ABOUT_FILES = {
  "contact.txt": { text: "opening contact.txt...", redirect: "/contact" },
};

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
  { label: "My Projects", command: "cd my-projects/" },
];

export default function AboutPage() {
  return (
    <main className="home home--fixed console">
      <div className="home-shell home-shell--stack">

        {/* Background decorative windows */}
        <section className="desktop-window desktop-window--about-skills" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">skills.json</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">{"{"}</span>
              <span className="desktop-line">{`  "languages": [${stack.languages.map(l => `"${l}"`).join(", ")}],`}</span>
              <span className="desktop-line">{`  "frameworks": [${stack.frameworks.map(f => `"${f}"`).join(", ")}],`}</span>
              <span className="desktop-line">{`  "db": [${stack.databases.map(d => `"${d}"`).join(", ")}],`}</span>
              <span className="desktop-line">{`  "tools": [${stack.tools.map(t => `"${t}"`).join(", ")}]`}</span>
              <span className="desktop-line text-green">{"}"}</span>
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--about-notes" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">readme.md</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green"># {name}</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">{role}</span>
              <span className="desktop-line">in Ausbildung @ {school}</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">Currently learning:</span>
              <span className="desktop-line">→ fullstack web dev</span>
              <span className="desktop-line">→ system architecture</span>
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--about-git" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">activity.log</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">● learning Next.js</span>
              <span className="desktop-line">● building portfolio</span>
              <span className="desktop-line">● studying for exams</span>
              <span className="desktop-line">● reading clean code</span>
            </pre>
          </div>
        </section>

        {/* Main about file viewer */}
        <section className="about-window" aria-label="About me — file viewer">
          <div className="console-header">
            <span className="console-dot console-dot--red" />
            <span className="console-dot console-dot--yellow" />
            <span className="console-dot console-dot--green" />
            <span className="console-title">cat about-me.txt — paul @ portfolio</span>
          </div>

          <div className="about-body">
            {/* identity + contact side by side */}
            <div className="about-top-row">
              <div className="about-section">
                <span className="about-comment">## identity</span>
                <div className="about-field">
                  <span className="about-key">name</span>
                  <span className="about-sep">:</span>
                  <span className="about-value about-value--accent">{name}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">role</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{role}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">location</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{location}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">school</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{school}</span>
                </div>
              </div>

              <div className="about-section">
                <span className="about-comment">## contact</span>
                <div className="about-field">
                  <span className="about-key">email</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{contact.email}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">github</span>
                  <span className="about-sep">:</span>
                  <a className="about-value about-value--link" href={contact.githubUrl} target="_blank" rel="noopener noreferrer">{contact.github}</a>
                </div>
                <div className="about-field">
                  <span className="about-key">linkedin</span>
                  <span className="about-sep">:</span>
                  <a className="about-value about-value--link" href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">{contact.linkedin}</a>
                </div>
              </div>
            </div>

            {/* stack full width below */}
            <div className="about-section">
              <span className="about-comment">## stack</span>
              <div className="about-field">
                <span className="about-key">languages</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.languages.map((l) => <span className="about-tag" key={l}>{l}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">frameworks</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.frameworks.map((f) => <span className="about-tag" key={f}>{f}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">databases</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.databases.map((d) => <span className="about-tag" key={d}>{d}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">tools</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.tools.map((t) => <span className="about-tag" key={t}>{t}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">certificates</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.certificates.map((c) => <span className="about-tag about-tag--cert" key={c}>{c}</span>)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <Console quickCommands={QUICK_COMMANDS} autoRun={false} files={ABOUT_FILES} dirs={{}} />
      </div>
    </main>
  );
}
