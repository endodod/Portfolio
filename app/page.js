"use client";
import { useEffect, useState } from "react";
import Console from "@/components/Console";
import { profile } from "@/content/profile";

const { name, location, contact } = profile;

function buildCalendarCells(now) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = (firstDow + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push({ day: null, isToday: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, isToday: d === today });
  return cells;
}

const QUICK_COMMANDS = [
  { label: "My Projects", command: "cd my-projects/" },
  { label: "About Me", command: "cat about-me.txt" },
];

export default function Home() {
  const [now, setNow] = useState(() => new Date());
  const time = now.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const calMonth = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const calCells = buildCalendarCells(now);
  const [gitLog, setGitLog] = useState(["loading..."]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/git-log")
      .then((r) => r.json())
      .then((d) => setGitLog(d.commits || ["(no data)"]))
      .catch(() => setGitLog(["(unavailable)"]));
  }, []);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((d) => setWeather(d.error ? "unavailable" : `${d.temp} · ${d.condition}`))
      .catch(() => setWeather("unavailable"));
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

        <section className="desktop-window desktop-window--cal" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">calendar.txt</span>
          </div>
          <div className="desktop-body desktop-body--cal">
            <div className="cal-month">{calMonth}</div>
            <div className="cal-grid">
              {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
                <span key={d} className="cal-header">{d}</span>
              ))}
              {calCells.map((cell, i) => (
                <span key={i} className={`cal-day${cell.isToday ? " cal-day--today" : ""}`}>
                  {cell.day ?? ""}
                </span>
              ))}
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
              <span>{weather ?? "—"}</span>
            </div>
          </div>
        </section>

        <Console quickCommands={QUICK_COMMANDS} />
      </div>
    </main>
  );
}
