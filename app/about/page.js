"use client";
import Console from "@/components/Console";
import { profile } from "@/content/profile";

const { name, role, location, school, contact, stack } = profile;

const ABOUT_FILES = {
  "contact.txt": { text: "opening contact.txt...", redirect: "/contact" },
};

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
];

export default function AboutPage() {
  return (
    <main className="home home--fixed console">
      <div className="home-shell home-shell--stack">

        {/* Background decorative windows */}
        <section className="desktop-window desktop-window--about-lang" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">languages.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">## spoken languages</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">german   {"██████████"}  C2</span>
              <span className="desktop-line">english  {"████████░░"}  C1</span>
              <span className="desktop-line">french   {"█████░░░░░"}  B1</span>
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
            <div className="about-section about-section--stack">
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
