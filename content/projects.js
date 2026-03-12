// ─────────────────────────────────────────
//  Projects — add, remove, or edit entries
//  here to update the projects page.
// ─────────────────────────────────────────

export const projects = [
  {
    name: "PortfolioAnalyzer",
    dir: "portfolio-analyzer/",
    description: "Web app for analyzing security portfolios with real-time stock data",
    stack: ["Python", "Flask", "MySQL", "Docker", "Bootstrap 5", "yfinance", "APScheduler", "Gunicorn", "pytest"],
    github: "github.com/endodod/PortfolioAnalyzer",
    githubUrl: "https://github.com/endodod/PortfolioAnalyzer",
    status: "stable",
  },
  {
    name: "BlackJack",
    dir: "blackjack/",
    description: "Browser-based Blackjack card game",
    stack: ["Next.js", "React", "JavaScript", "CSS", "Vercel"],
    github: "github.com/endodod/BlackJack",
    githubUrl: "https://github.com/endodod/BlackJack",
    live: "blackjack.paulkuehn.ch",
    liveUrl: "https://blackjack.paulkuehn.ch",
    status: "stable",
  },
  {
    name: "Portfolio",
    dir: "portfolio/",
    description: "This terminal-style developer portfolio",
    stack: ["Next.js", "React", "JavaScript", "CSS", "Vercel", "Github API", "Open-Meteo"],
    github: "github.com/endodod/Portfolio",
    githubUrl: "https://github.com/endodod/Portfolio",
    live: "paulkuehn.ch",
    liveUrl: "https://paulkuehn.ch",
    status: "active",
  },
];
