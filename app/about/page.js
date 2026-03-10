"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="home console">
      <div className="home-shell">

        {/* Background decorative windows */}
        <section className="desktop-window desktop-window--about-skills" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">skills.json</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">{"{"}</span>
              <span className="desktop-line">{"  \"languages\": [\"TS\", \"Python\"],"}</span>
              <span className="desktop-line">{"  \"frameworks\": [\"Next.js\", \"Tailwind\"],"}</span>
              <span className="desktop-line">{"  \"db\": [\"MySQL\"],"}</span>
              <span className="desktop-line">{"  \"tools\": [\"git\", \"GitHub\"]"}</span>
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
              <span className="desktop-line text-green"># Paul Kühn</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">Applikationsentwickler</span>
              <span className="desktop-line">in Ausbildung @ IMS Zürich</span>
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
            <div className="about-file-header">
              <span className="about-comment"># ──────────────────────────────────────</span>
              <span className="about-comment">#  about-me.txt</span>
              <span className="about-comment"># ──────────────────────────────────────</span>
            </div>

            <div className="about-section">
              <span className="about-comment">## identity</span>
              <div className="about-field">
                <span className="about-key">name</span>
                <span className="about-sep">:</span>
                <span className="about-value about-value--accent">Paul Kühn</span>
              </div>
              <div className="about-field">
                <span className="about-key">role</span>
                <span className="about-sep">:</span>
                <span className="about-value">Applikationsentwickler in Ausbildung</span>
              </div>
              <div className="about-field">
                <span className="about-key">location</span>
                <span className="about-sep">:</span>
                <span className="about-value">Zürich, Switzerland</span>
              </div>
              <div className="about-field">
                <span className="about-key">school</span>
                <span className="about-sep">:</span>
                <span className="about-value">IMS Zürich</span>
              </div>
            </div>

            <div className="about-section">
              <span className="about-comment">## stack</span>
              <div className="about-field">
                <span className="about-key">languages</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  <span className="about-tag">TypeScript</span>
                  <span className="about-tag">Python</span>
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">frameworks</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  <span className="about-tag">Next.js</span>
                  <span className="about-tag">Tailwind CSS</span>
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">databases</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  <span className="about-tag">MySQL</span>
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">tools</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  <span className="about-tag">Git / GitHub</span>
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">certificates</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  <span className="about-tag about-tag--cert">Abacus «Anwender» 2024</span>
                  <span className="about-tag about-tag--cert">Claude 101</span>
                  <span className="about-tag about-tag--cert">Claude Code in Action</span>
                </span>
              </div>
            </div>

            <div className="about-section">
              <span className="about-comment">## interests</span>
              <div className="about-field">
                <span className="about-key">tech</span>
                <span className="about-sep">:</span>
                <span className="about-value">web dev, system design, open source</span>
              </div>
              <div className="about-field">
                <span className="about-key">hobbies</span>
                <span className="about-sep">:</span>
                <span className="about-value">music, gaming, hiking</span>
              </div>
            </div>

            <div className="about-section">
              <span className="about-comment">## contact</span>
              <div className="about-field">
                <span className="about-key">github</span>
                <span className="about-sep">:</span>
                <span className="about-value about-value--link">github.com/im24a-kuehnp</span>
              </div>
              <div className="about-field">
                <span className="about-key">email</span>
                <span className="about-sep">:</span>
                <span className="about-value">paul@example.com</span>
              </div>
            </div>

            <div className="about-nav">
              <Link href="/" className="console-link">$ cd ~</Link>
              <Link href="/projects" className="console-link">$ cd my-projects/</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
