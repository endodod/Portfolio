"use client";
import { useEffect, useState } from "react";
import Console from "@/components/Console";
import { profile } from "@/content/profile";

const { name, location, contact } = profile;

const QUICK_COMMANDS = [
  { label: "My Projects", command: "cd my-projects/" },
  { label: "About Me", command: "cat about-me.txt" },
];

export default function Home() {
  const [time, setTime] = useState("");
  const [gitLog, setGitLog] = useState(["loading..."]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/git-log")
      .then((r) => r.json())
      .then((d) => setGitLog(d.commits || ["(no data)"]))
      .catch(() => setGitLog(["(unavailable)"]));
  }, []);

  return (
    <main className="home console">
      <div className="home-shell">
        {/* Background "desktop" programs */}
        <section className="desktop-window desktop-window--help-console" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-dot desktop-dot--red" />
            <span className="desktop-dot desktop-dot--yellow" />
            <span className="desktop-dot desktop-dot--green" />
            <span className="desktop-title">help — paul @ portfolio</span>
          </div>
          <div className="desktop-body desktop-body--console">
            <pre>
              <span className="desktop-line">paul @ portfolio ~ $ help</span>
              <span className="desktop-line">help     - show available commands</span>
              <span className="desktop-line">ls       - list files in current directory</span>
              <span className="desktop-line">cd       - change directory (e.g. cd my-projects/)</span>
              <span className="desktop-line">cat      - display file (e.g. cat about-me.txt)</span>
              <span className="desktop-line">whoami   - show current user info</span>
              <span className="desktop-line">clear    - clear the console</span>
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--player" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">now-playing.mp3</span>
          </div>
          <div className="desktop-body desktop-body--player">
            <div className="player-track">lofi-focus-loop-07</div>
            <div className="player-bar">
              <span className="player-time">01:12</span>
              <span className="player-rail">
                <span className="player-progress" />
              </span>
              <span className="player-time">03:48</span>
            </div>
            <div className="player-controls">
              <span>⏮</span>
              <span>⏯</span>
              <span>⏭</span>
            </div>
          </div>
        </section>

        <section className="desktop-window desktop-window--notes" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">contact.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line">{name}</span>
              <span className="desktop-line">{location}</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">mail: {contact.email}</span>
              <span className="desktop-line">github: {contact.github}</span>
              <span className="desktop-line">linkedin: {contact.linkedin}</span>
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--git" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">git log --oneline</span>
          </div>
          <div className="desktop-body">
            <pre>
              {gitLog.map((line, i) => (
                <span key={i} className={`desktop-line${i === 0 ? " text-green" : ""}`}>{line}</span>
              ))}
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--status" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">status-center</span>
          </div>
          <div className="desktop-body desktop-body--status">
            <div className="status-row">
              <span>time</span>
              <span>{time || "—"}</span>
            </div>
            <div className="status-row">
              <span>weather</span>
              <span>12°C · clear</span>
            </div>
            <div className="status-row">
              <span>headline</span>
              <span>new build deployed to prod</span>
            </div>
          </div>
        </section>

        <Console quickCommands={QUICK_COMMANDS} />
      </div>
    </main>
  );
}
