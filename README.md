# Portfolio

A terminal/console-style personal developer portfolio built with Next.js.

🌐 **Live:** [paulkuehn.ch](https://paulkuehn.ch)

---

## Stack

Next.js 16 · React 19 · CSS · ESLint · Vercel

---

## Features

- Interactive terminal with command history and typewriter output
- Decorative OS-style background windows (git log, weather, contact, help)
- Live weather via Open-Meteo based on visitor location
- Live git log pulled from GitHub API
- Automatic viewport scaling across different monitor sizes and DPI settings

---

## Getting Started

```bash
git clone https://github.com/endodod/Portfolio.git
cd Portfolio
npm install
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Optional — avoids GitHub API rate limits on the git log widget |

---

## Customization

- **Personal info, contact, stack** → `content/profile.js`
- **Projects** → `content/projects.js`