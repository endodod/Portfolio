"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/content/profile";

const { whoami } = profile;
const PROMPT = "paul @ portfolio ~ $ ";
const KNOWN_BINS = ["help", "ls", "cd", "cat", "whoami", "clear", "pwd", "echo"];

export default function Console({ quickCommands = [], autoRun = true, files = {}, dirs = null }) {
  const router = useRouter();
  const [consoleText, setConsoleText] = useState("");
  const [queue, setQueue] = useState([]);
  const [command, setCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("console-history") || "[]"); } catch { return []; }
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorPos, setCursorPos] = useState(0);
  const [allSelected, setAllSelected] = useState(false);
  const draftCommand = useRef("");
  const containerRef = useRef(null);
  const outputWrapperRef = useRef(null);
  const commandTextRef = useRef(null);
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
      const char = segment.charAt(i);
      setConsoleText((prev) => prev + char);
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


    if (cmd === "help") {
      response =
        "help     - show available commands\n" +
        "ls       - list files in current directory\n" +
        "cd       - change directory (e.g. cd my-projects/)\n" +
        "cat      - display file (e.g. cat about-me.txt)\n" +
        "whoami   - show current user info\n" +
        "clear    - clear the console";
    } else if (cmd === "ls" || cmd === "ls .") {
      const fileKeys = Object.keys(files);
      const dirKeys = dirs !== null ? Object.keys(dirs).map((d) => d + "/") : [];
      if (fileKeys.length > 0 || dirKeys.length > 0) {
        response = [...fileKeys, ...dirKeys].join("  ");
      } else if (dirs === null) {
        response = "about-me.txt  my-projects/";
      } else {
        response = "";
      }
    } else if (bin === "ls") {
      if (arg.startsWith("-")) {
        response = `ls: unknown argument '${arg}'\nTry 'help' for available commands.`;
      } else {
        response = `ls: cannot access '${arg}': No such file or directory`;
      }
    } else if (bin === "cd") {
      if (arg.startsWith("-")) {
        response = `cd: unknown argument '${arg}'\nTry 'help' for available commands.`;
      } else if (!arg || arg === "~") {
        response = "navigating home...";
        redirect = "/";
      } else if (dirs !== null) {
        if (dirs[arg] !== undefined) {
          response = `navigating to ${arg}...`;
          redirect = dirs[arg];
        } else {
          response = `cd: ${arg}: No such file or directory`;
        }
      } else if (arg === "my-projects") {
        response = "navigating to my projects...";
        redirect = "/projects";
      } else {
        response = `cd: ${arg}: No such file or directory`;
      }
    } else if (bin === "cat") {
      if (!arg) {
        response = "cat: missing operand\nUsage: cat <file>";
      } else if (arg.startsWith("-")) {
        response = `cat: unknown argument '${arg}'\nTry 'help' for available commands.`;
      } else if (files[arg] !== undefined) {
        const entry = files[arg];
        if (typeof entry === "object" && entry.redirect) {
          response = entry.text || `opening ${arg}...`;
          redirect = entry.redirect;
        } else {
          response = entry;
        }
      } else if (dirs === null && arg === "about-me.txt") {
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
    } else if (KNOWN_BINS.includes(bin)) {
      response = `${bin}: invalid usage\nTry 'help' for available commands.`;
    } else {
      response = `bash: ${bin}: command not found`;
    }

    setHistory((prev) => {
      const next = [cmd, ...prev];
      try { sessionStorage.setItem("console-history", JSON.stringify(next)); } catch {}
      return next;
    });
    setHistoryIndex(-1);
    draftCommand.current = "";

    // Commit prompt + command instantly; only typewrite the response
    setConsoleText((prev) => prev + `${PROMPT}${cmd}\n`);
    const navigate = redirect
      ? () => redirect.startsWith("http") ? window.open(redirect, "_blank", "noopener,noreferrer") : router.push(redirect)
      : null;
    if (response) {
      const queueItem = navigate
        ? { text: response + "\n", onComplete: navigate }
        : response + "\n";
      setQueue((prev) => [...prev, queueItem]);
    } else if (navigate) {
      navigate();
    }
    containerRef.current?.focus();
  };

  const getTabCandidates = (bin, partial) => {
    if (!bin) return KNOWN_BINS.filter((b) => b.startsWith(partial));
    if (bin === "cat") {
      const fileNames = Object.keys(files);
      if (dirs === null) fileNames.push("about-me.txt");
      return fileNames.filter((f) => f.startsWith(partial));
    }
    if (bin === "cd") {
      const dirNames = dirs !== null
        ? Object.keys(dirs).map((d) => d + "/")
        : ["my-projects/"];
      return dirNames.filter((d) => d.startsWith(partial));
    }
    return [];
  };

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setAllSelected(false);
  };

  const handleKeyDown = (e) => {
    if (isTyping) return;

    if (allSelected) {
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        setCommand("");
        setCursorPos(0);
        draftCommand.current = "";
        clearSelection();
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setCommand(e.key);
        setCursorPos(1);
        draftCommand.current = e.key;
        clearSelection();
        return;
      }
      clearSelection();
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const hasArg = command.includes(" ");
      const partial = hasArg ? command.slice(command.indexOf(" ") + 1) : command;
      if (!partial) return;

      const bin = hasArg ? command.slice(0, command.indexOf(" ")) : "";
      const candidates = getTabCandidates(hasArg ? bin : null, partial);
      if (candidates.length === 0) return;

      const prefix = candidates.reduce((a, b) => {
        let i = 0;
        while (i < a.length && a[i] === b[i]) i++;
        return a.slice(0, i);
      });
      if (prefix.length <= partial.length) return;

      const completed = hasArg ? `${bin} ${prefix}` : prefix;
      setCommand(completed);
      setCursorPos(completed.length);
      if (historyIndex === -1) draftCommand.current = completed;
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCursorPos((p) => Math.max(0, p - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setCursorPos((p) => Math.min(command.length, p + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setCursorPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setCursorPos(command.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = command.trim();
      if (cmd) runCommand(cmd);
      setCommand("");
      setCursorPos(0);
      draftCommand.current = "";
      setHistoryIndex(-1);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      if (cursorPos === 0) return;
      setCommand((prev) => {
        const next = prev.slice(0, cursorPos - 1) + prev.slice(cursorPos);
        if (historyIndex === -1) draftCommand.current = next;
        return next;
      });
      setCursorPos((p) => p - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setCommand(history[next]);
      setCursorPos(history[next].length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      if (next < 0) {
        setHistoryIndex(-1);
        setCommand(draftCommand.current);
        setCursorPos(draftCommand.current.length);
      } else {
        setHistoryIndex(next);
        setCommand(history[next]);
        setCursorPos(history[next].length);
      }
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setConsoleText("");
    } else if (e.ctrlKey && e.key === "a") {
      e.preventDefault();
      if (command.length > 0 && commandTextRef.current) {
        const range = document.createRange();
        range.selectNodeContents(commandTextRef.current);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        setAllSelected(true);
      }
    } else if (e.ctrlKey && e.key === "e") {
      e.preventDefault();
      setCursorPos(command.length);
    } else if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setConsoleText((prev) => prev + `${PROMPT}${command}^C\n`);
      setCommand("");
      setCursorPos(0);
      setQueue([]);
      setHistoryIndex(-1);
      draftCommand.current = "";
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setCommand((prev) => {
        const next = prev.slice(0, cursorPos) + e.key + prev.slice(cursorPos);
        if (historyIndex === -1) draftCommand.current = next;
        return next;
      });
      setCursorPos((p) => p + 1);
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
            {!isTyping && queue.length === 0 ? (
              <>{PROMPT}<span ref={commandTextRef}>{command.slice(0, cursorPos)}<span className="console-cursor" aria-hidden="true">{command[cursorPos] ?? ' '}</span>{command.slice(cursorPos + 1)}</span></>
            ) : (
              <span className="console-cursor" aria-hidden="true"> </span>
            )}
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
