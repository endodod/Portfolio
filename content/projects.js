// ─────────────────────────────────────────
//  Projects — add, remove, or edit entries
//  here to update the projects page.
// ─────────────────────────────────────────

export const projects = [
  {
    name: "Portfolio",
    dir: "portfolio/",
    description: "Terminal-style developer portfolio with an interactive bash console — navigate pages via commands, browse projects, and view live git activity",
    stack: ["Next.js", "React", "JavaScript", "CSS", "Vercel", "Github API", "Open-Meteo"],
    github: "github.com/endodod/Portfolio",
    githubUrl: "https://github.com/endodod/Portfolio",
    live: "paulkuehn.ch",
    liveUrl: "https://paulkuehn.ch",
  },
  {
    name: "PortfolioAnalyzer",
    dir: "portfolio-analyzer/",
    description: "Web app for analyzing security portfolios with real-time stock data",
    stack: ["Python", "Flask", "MySQL", "Docker", "Bootstrap 5", "yfinance"],
    github: "github.com/endodod/PortfolioAnalyzer",
    githubUrl: "https://github.com/endodod/PortfolioAnalyzer",
  },
  {
    name: "TFT Notes",
    dir: "tft-notes/",
    description: "Overwolf in-game overlay and web companion for Teamfight Tactics — auto-captures game events, records VODs with round-level bookmarks, and analyzes board states via OCR",
    stack: ["React", "Tailwind CSS", "SQLite", "Tesseract.js", "Express", "Next.js", "TypeScript", "Prisma", "Overwolf"],
    repos: [
      { label: "overwolf", github: "github.com/endodod/tft-notes-overwolf", githubUrl: "https://github.com/endodod/tft-notes-overwolf" },
      { label: "web", github: "github.com/endodod/tft-notes-web", githubUrl: "https://github.com/endodod/tft-notes-web" },
    ],
  },
  {
    name: "SAP",
    dir: "sap/",
    description: "End-to-end reinforcement learning system for Super Auto Pets — terminal game simulation, PPO-trained agent, and public dashboard visualizing learned pet strategies and win-rates",
    stack: ["Python", "PyTorch", "Stable-Baselines3", "Next.js", "TypeScript", "Vercel"],
    repos: [
      { label: "sim", github: "github.com/endodod/sap-sim", githubUrl: "https://github.com/endodod/sap-sim" },
      { label: "agent", github: "github.com/endodod/sap-agent", githubUrl: "https://github.com/endodod/sap-agent" },
      { label: "dashboard", github: "github.com/endodod/sap-dashboard", githubUrl: "https://github.com/endodod/sap-dashboard" },
    ],
  },
  {
    name: "BlackJack",
    dir: "blackjack/",
    description: "Browser-based Blackjack card game with Multiplayer support",
    stack: ["Next.js", "React", "JavaScript", "CSS", "Vercel", "Prisma", "PostgreSQL"],
    github: "github.com/endodod/BlackJack",
    githubUrl: "https://github.com/endodod/BlackJack",
    live: "blackjack.paulkuehn.ch",
    liveUrl: "https://blackjack.paulkuehn.ch",
  },
  {
    name: "Floored",
    dir: "floored/",
    description: "Browser-based roguelike casino game — survive escalating floors with rising minimum bets across eight casino games",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Prisma", "PostgreSQL", "Zustand", "Framer Motion", "PixiJS", "Vercel"],
    github: "github.com/endodod/Floored",
    githubUrl: "https://github.com/endodod/Floored",
    live: "floored.paulkuehn.ch",
    liveUrl: "https://floored.paulkuehn.ch/",
  },
];
