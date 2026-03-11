"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/content/profile";

const { whoami } = profile;
const PROMPT = "paul @ portfolio ~ $ ";

export default function Console({ quickCommands = [], autoRun = true }) {
  const router = useRouter();
  const [consoleText, setConsoleText] = useState("");
  const [queue, setQueue] = useState([]);
  const [command, setCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const draftCommand = useRef("");
  const containerRef = useRef(null);
  const outputWrapperRef = useRef(null);
  const hasInit = useRef(false);

  useEffect(() => {
    containerRef.current?.focus();
    if (hasInit.current) return;
    hasInit.current = true;
    if (autoRun) runCommand("whoami");
  }, []);

  useEffect(() => {
    const el = outputWrapperRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [consoleText, command]);

  useEffect(() => {
    if (isTyping || queue.length === 0) return;
    setIsTyping(true);
    const item = queue[0];
    const segment = typeof item === "string" ? item : item.text;
    const onComplete = typeof item === "object" ? item.onComplete : null;
    let i = 0;

    const interval = setInterval(() => {
      setConsoleText((prev) => prev + segment.charAt(i));
      i++;
      if (i >= segment.length) {
        clearInterval(interval);
        setIsTyping(false);
        setQueue((prev) => prev.slice(1));
        if (onComplete) onComplete();
      }
    }, 8);

    return () => { clearInterval(interval); setIsTyping(false); };
  }, [queue]);

  const runCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    let response = "";
    let redirect = null;

    const argv = cmd.split(/\s+/);
    const bin = argv[0];
    const arg = argv.slice(1).join(" ").replace(/\/$/, "");

    const knownBins = ["help", "ls", "cd", "cat", "whoami", "clear", "pwd", "echo"];

    if (cmd === "help") {
      response =
        "help     - show available commands\n" +
        "ls       - list files in current directory\n" +
        "cd       - change directory (e.g. cd my-projects/)\n" +
        "cat      - display file (e.g. cat about-me.txt)\n" +
        "whoami   - show current user info\n" +
        "clear    - clear the console";
    } else if (cmd === "ls" || cmd === "ls .") {
      response = "about-me.txt  my-projects/  contact/";
    } else if (bin === "ls") {
      response = `ls: cannot access '${arg}': No such file or directory`;
    } else if (bin === "cd") {
      if (!arg || arg === "~") {
        response = "navigating home...";
        redirect = "/";
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
      } else {
        response = `cat: ${arg}: No such file or directory`;
      }
    } else if (cmd === "whoami") {
      response = whoami.map((l) => `  ${l}`).join("\n");
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

    const entry = `${PROMPT}${cmd}\n${response}\n`;
    const queueItem = redirect
      ? { text: entry, onComplete: () => router.push(redirect) }
      : entry;
    setQueue((prev) => [...prev, queueItem]);
    containerRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (isTyping) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = command.trim();
      if (cmd) runCommand(cmd);
      setCommand("");
      draftCommand.current = "";
      setHistoryIndex(-1);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setCommand((prev) => {
        const next = prev.slice(0, -1);
        if (historyIndex === -1) draftCommand.current = next;
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
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
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setConsoleText("");
    } else if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setConsoleText((prev) => prev + `${PROMPT}${command}^C\n`);
      setCommand("");
      setHistoryIndex(-1);
      draftCommand.current = "";
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setCommand((prev) => {
        const next = prev + e.key;
        if (historyIndex === -1) draftCommand.current = next;
        return next;
      });
    }
  };

  return (
    <section
      className="console-window"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
      aria-label="Interactive console"
    >
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
            {!isTyping && queue.length === 0 && <>{PROMPT}{command}</>}
            <span className="console-cursor" aria-hidden="true">▍</span>
          </pre>
        </div>

        {quickCommands.length > 0 && (
          <div className="console-links">
            <span className="console-comment"># quick commands</span>
            <div className="console-links-row">
              {quickCommands.map(({ label, command: cmd }) => (
                <button
                  key={label}
                  type="button"
                  className="console-link"
                  onClick={() => !isTyping && runCommand(cmd)}
                  disabled={isTyping}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
