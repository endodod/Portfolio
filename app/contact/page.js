"use client";
import Console from "@/components/Console";
import { profile } from "@/content/profile";

const { name, location, contact } = profile;

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
];

const HOME_FILES = {
  "about-me.txt": { text: "navigating to about...", redirect: "/about" },
  "contact.txt": "",
};

const HOME_DIRS = {
  "my-projects": "/projects",
};

export default function ContactPage() {
  return (
    <main className="home home--fixed console">
      <div className="home-shell home-shell--stack">

        {/* Main contact file viewer */}
        <section className="about-window" aria-label="Contact — file viewer">
          <div className="console-header">
            <span className="console-dot console-dot--red" />
            <span className="console-dot console-dot--yellow" />
            <span className="console-dot console-dot--green" />
            <span className="console-title">cat contact.txt — paul @ portfolio</span>
          </div>

          <div className="about-body">
            <div className="about-section">
              <span className="about-comment">## contact</span>
              <div className="about-field">
                <span className="about-key">name</span>
                <span className="about-sep">:</span>
                <span className="about-value about-value--accent">{name}</span>
              </div>
              <div className="about-field">
                <span className="about-key">location</span>
                <span className="about-sep">:</span>
                <span className="about-value">{location}</span>
              </div>
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
        </section>

        <Console
          quickCommands={QUICK_COMMANDS}
          autoRun="ls"
          files={HOME_FILES}
          dirs={HOME_DIRS}
          readOnly
        />
      </div>
    </main>
  );
}
