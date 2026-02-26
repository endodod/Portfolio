"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getSpotifyPlaylistId() {
  const raw = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID;
  if (!raw) return null;
  const m = raw.match(/playlist\/([a-zA-Z0-9]+)/);
  return m ? m[1] : raw.trim();
}

export default function Home() {
  const router = useRouter();
  const [consoleText, setConsoleText] = useState("");
  const [queue, setQueue] = useState([]);
  const [command, setCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [gitLog, setGitLog] = useState([]);
  const [time, setTime] = useState("");
  const [githubActivity, setGithubActivity] = useState(null);
  const outputWrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Live clock
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch last 5 git commits from this repo
  useEffect(() => {
    fetch("/api/git-log")
      .then((r) => r.json())
      .then(({ commits }) => setGitLog(commits || []))
      .catch(() => setGitLog([]));
  }, []);

  // Fetch latest GitHub activity
  useEffect(() => {
    fetch("/api/github-activity")
      .then((r) => r.json())
      .then((data) => setGithubActivity(data))
      .catch(() => setGithubActivity(null));
  }, []);

  // Auto-run whoami at startup
  useEffect(() => {
    runCommand("whoami");
  }, []);

  // Auto-scroll to bottom when console output changes
  useEffect(() => {
    const el = outputWrapperRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [consoleText]);

  // Typewriter effect that drains the queue one segment at a time
  useEffect(() => {
    if (isTyping || queue.length === 0) return;

    setIsTyping(true);
    const item = queue[0];
    const segment = typeof item === "string" ? item : item.text;
    const onComplete = typeof item === "object" ? item.onComplete : null;
    let i = 0;

    const interval = setInterval(() => {
      setConsoleText((prev) => prev + segment.charAt(i));
      i += 1;
      if (i >= segment.length) {
        clearInterval(interval);
        setIsTyping(false);
        setQueue((prev) => prev.slice(1));
        if (onComplete) onComplete();
      }
    }, 22);

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [queue]);

  const runCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    let response = "";
    let redirect = null;

    if (cmd === "help") {
      response =
        "help     - show available commands\n" +
        "ls       - list files in current directory\n" +
        "cd       - change directory (e.g. cd my-projects/)\n" +
        "cat      - display file contents (e.g. cat about-me.txt)\n" +
        "whoami   - show current user info\n" +
        "clear    - clear the console";
    } else if (cmd === "ls") {
      response = "about-me.txt  my-projects/  contact/";
    } else if (cmd === "cd my-projects" || cmd === "cd my-projects/") {
      response = "navigating to my projects...";
      redirect = "/projects";
    } else if (cmd === "cat about-me.txt") {
      response = "opening about-me.txt...";
      redirect = "/about";
    } else if (cmd === "whoami") {
      response =
        "  Paul Kühn\n" +
        "  Applikationsentwickler in Ausbildung\n" +
        "  Zürich, Switzerland";
    } else if (cmd === "clear") {
      setConsoleText("");
      return;
    } else {
      response = `command not found: ${cmd}`;
    }

    const entry = `paul @ portfolio ~ $ ${cmd}\n${response}\n`;
    const queueItem = redirect
      ? { text: entry, onComplete: () => setTimeout(() => router.push(redirect), 500) }
      : entry;
    setQueue((prev) => [...prev, queueItem]);
    inputRef.current?.focus();
  };

  return (
    <main className="home console">
      <div className="home-shell">
        {/* Background "desktop" programs */}
        {/* Help console - shows available commands */}
        <section
          className="desktop-window desktop-window--help-console"
          aria-hidden="true"
        >
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

        {/* Music player - Spotify embed when playlist configured */}
        <section
          className="desktop-window desktop-window--player"
          aria-hidden="true"
        >
          <div className="desktop-header">
            <span className="desktop-title">
              {process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID ? "spotify" : "now-playing.mp3"}
            </span>
          </div>
          <div className="desktop-body desktop-body--player">
            {getSpotifyPlaylistId() ? (
              <div className="player-embed-wrap">
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${getSpotifyPlaylistId()}?utm_source=generator`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify playlist"
                  className="player-embed"
                />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </section>

        {/* Notes - contact details (top right) */}
        <section
          className="desktop-window desktop-window--notes"
          aria-hidden="true"
        >
          <div className="desktop-header">
            <span className="desktop-title">contact.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line">Paul Kühn</span>
              <span className="desktop-line">Zürich, Switzerland</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">mail: paul@example.com</span>
              <span className="desktop-line">github: github.com/{process.env.NEXT_PUBLIC_GITHUB_USER || "im24a-kuehnp"}</span>
              <span className="desktop-line">linkedin: linkedin.com/in/paul-kuehn</span>
            </pre>
          </div>
        </section>

        {/* Currently working on (from GitHub) */}
        <section
          className="desktop-window desktop-window--activity"
          aria-hidden="true"
        >
          <div className="desktop-header">
            <span className="desktop-title">currently working on</span>
          </div>
          <div className="desktop-body desktop-body--activity">
            {githubActivity?.repo && githubActivity?.message ? (
              <>
                <a
                  href={`https://github.com/${githubActivity.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-repo"
                >
                  {githubActivity.repo}
                </a>
                <span className="activity-message">{githubActivity.message}</span>
              </>
            ) : githubActivity?.error ? (
              <span className="activity-fallback">—</span>
            ) : (
              <span className="activity-fallback">loading…</span>
            )}
          </div>
        </section>

        {/* Git log (bottom right) */}
        <section
          className="desktop-window desktop-window--git"
          aria-hidden="true"
        >
          <div className="desktop-header">
            <span className="desktop-title">git log --oneline</span>
          </div>
          <div className="desktop-body">
            <pre>
              {gitLog.length > 0 ? (
                gitLog.map((line, i) => (
                  <span
                    key={i}
                    className={`desktop-line${i === 0 ? " text-green" : ""}`}
                  >
                    {line}
                  </span>
                ))
              ) : (
                <span className="desktop-line">loading…</span>
              )}
            </pre>
          </div>
        </section>

        {/* Clock */}
        <section
          className="desktop-window desktop-window--status"
          aria-hidden="true"
        >
          <div className="desktop-header">
            <span className="desktop-title">clock</span>
          </div>
          <div className="desktop-body desktop-body--clock">
            <time dateTime={new Date().toISOString()} className="clock-time">
              {time}
            </time>
          </div>
        </section>

        {/* Foreground console */}
        <section className="console-window" aria-label="Console portfolio intro">
          <div className="console-header">
            <span className="console-dot console-dot--red" />
            <span className="console-dot console-dot--yellow" />
            <span className="console-dot console-dot--green" />
            <span className="console-title">paul-kuehn: ~/portfolio</span>
          </div>

          <div className="console-body">
            <div ref={outputWrapperRef} className="console-output-wrapper">
            <pre className="console-output">
              {consoleText}
              <span className="console-cursor" aria-hidden="true">
                ▍
              </span>
            </pre>
            </div>

            <form
              className="console-input"
              onSubmit={(e) => {
                e.preventDefault();
                if (!command.trim() || isTyping) return;
                runCommand(command);
                setCommand("");
              }}
            >
              <span className="console-input-prompt">paul @ portfolio ~ $</span>
              <input
                ref={inputRef}
                className="console-input-field"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder={isTyping ? "typing..." : "type a command... (try `help`)"}
                autoComplete="off"
                readOnly={isTyping}
                aria-readonly={isTyping}
              />
            </form>

            <div className="console-links">
              <span className="console-comment"># quick commands</span>
              <div className="console-links-row">
                <button
                  type="button"
                  className="console-link"
                  onClick={() => !isTyping && runCommand("cd my-projects/")}
                  disabled={isTyping}
                >
                  $ cd my-projects/
                </button>
                <button
                  type="button"
                  className="console-link"
                  onClick={() => !isTyping && runCommand("cat about-me.txt")}
                  disabled={isTyping}
                >
                  $ cat about-me.txt
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
