"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { profile } from "@/content/profile";

const { name, location, whoami, contact } = profile;

export default function Home() {
  const router = useRouter();
  const [consoleText, setConsoleText] = useState("");
  const [queue, setQueue] = useState([]);
  const [command, setCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [time, setTime] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const draftCommand = useRef("");
  const [gitLog, setGitLog] = useState(["loading..."]);
  const outputWrapperRef = useRef(null);
  const inputRef = useRef(null);
  const hasInit = useRef(false);

  // Auto-run whoami at startup
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;
    runCommand("whoami");
  }, []);

  // Realtime clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch git log from GitHub
  useEffect(() => {
    fetch("/api/git-log")
      .then((r) => r.json())
      .then((d) => setGitLog(d.commits || ["(no data)"]))
      .catch(() => setGitLog(["(unavailable)"]));
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
    }, 8);

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

    const argv = cmd.split(/\s+/);
    const bin = argv[0];
    const arg = argv.slice(1).join(" ").replace(/\/$/, "");

    const knownDirs = ["my-projects", "~", "."];
    const knownBins = ["help", "ls", "cd", "cat", "whoami", "clear", "pwd", "echo"];

    if (cmd === "help") {
      response =
        "help     - show available commands\n" +
        "ls       - list files in current directory\n" +
        "cd       - change directory (e.g. cd my-projects/)\n" +
        "cat      - display file contents (e.g. cat about-me.txt)\n" +
        "whoami   - show current user info\n" +
        "clear    - clear the console";
    } else if (cmd === "ls" || cmd === "ls .") {
      response = "about-me.txt  my-projects/  contact/";
    } else if (bin === "ls") {
      response = `ls: cannot access '${arg}': No such file or directory`;
    } else if (bin === "cd") {
      if (!arg || arg === "~") {
        response = "";
      } else if (arg === "my-projects") {
        response = "navigating to my projects...";
        redirect = "/projects";
      } else if (arg === "contact") {
        response = "navigating to contact...";
        redirect = "/contact";
      } else {
        response = `cd: ${arg}: No such file or directory`;
      }
    } else if (bin === "cat") {
      if (!arg) {
        response = "cat: missing operand\nUsage: cat <file>";
      } else if (arg === "about-me.txt") {
        response = "opening about-me.txt...";
        redirect = "/about";
      } else if (knownDirs.includes(arg)) {
        response = `cat: ${arg}: Is a directory`;
      } else {
        response = `cat: ${arg}: No such file or directory`;
      }
    } else if (cmd === "whoami") {
      response = whoami.map((line) => `  ${line}`).join("\n");
    } else if (cmd === "pwd") {
      response = "/home/paul/portfolio";
    } else if (bin === "echo") {
      response = arg;
    } else if (cmd === "clear") {
      setConsoleText("");
      return;
    } else if (knownBins.includes(bin)) {
      response = `${bin}: invalid usage\nTry 'help' for available commands.`;
    } else {
      response = `bash: ${bin}: command not found`;
    }

    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    draftCommand.current = "";

    const entry = `paul @ portfolio ~ $ ${cmd}\n${response}\n`;
    const queueItem = redirect
      ? { text: entry, onComplete: () => router.push(redirect) }
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

        {/* Music player */}
        <section
          className="desktop-window desktop-window--player"
          aria-hidden="true"
        >
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
              <span className="desktop-line">{name}</span>
              <span className="desktop-line">{location}</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">mail: {contact.email}</span>
              <span className="desktop-line">github: {contact.github}</span>
              <span className="desktop-line">linkedin: {contact.linkedin}</span>
            </pre>
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
              {gitLog.map((line, i) => (
                <span key={i} className={`desktop-line${i === 0 ? " text-green" : ""}`}>{line}</span>
              ))}
            </pre>
          </div>
        </section>

        {/* Clock / news / weather */}
        <section
          className="desktop-window desktop-window--status"
          aria-hidden="true"
        >
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
                onChange={(e) => {
                  setCommand(e.target.value);
                  if (historyIndex === -1) draftCommand.current = e.target.value;
                }}
                onKeyDown={(e) => {
                  if (isTyping || history.length === 0) return;
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    const next = Math.min(historyIndex + 1, history.length - 1);
                    setHistoryIndex(next);
                    setCommand(history[next]);
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    const next = historyIndex - 1;
                    if (next < 0) {
                      setHistoryIndex(-1);
                      setCommand(draftCommand.current);
                    } else {
                      setHistoryIndex(next);
                      setCommand(history[next]);
                    }
                  }
                }}
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
                  My Projects
                </button>
                <button
                  type="button"
                  className="console-link"
                  onClick={() => !isTyping && runCommand("cat about-me.txt")}
                  disabled={isTyping}
                >
                  About Me
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
