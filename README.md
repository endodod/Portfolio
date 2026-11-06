# Portfolio

A terminal/console-style personal developer portfolio built with Next.js.

🌐 **Live:** [paulkuehn.ch](https://paulkuehn.ch)

---

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · ESLint · Vercel

---

## Pages

- **Home (`/`)** — interactive terminal with command history and typewriter output, plus decorative background windows: help console, contact card, live git log, and live weather
- **About (`/about`)** — languages, and live widgets for top Spotify artists, recently played Steam games, and recent League of Legends match
- **Projects (`/projects`)** — project list with modal detail view and a live "top projects by commits" widget
- **Contact (`/contact`)** — contact info file viewer

---

## Features

- Interactive terminal with command history, typewriter output, and virtual filesystem navigation (`cd`, `ls`, etc.)
- Decorative OS-style background windows across pages
- Live weather via Open-Meteo, geolocated from visitor IP
- Live git log pulled from the GitHub API
- Top GitHub projects ranked by commit count
- Top Spotify artists (last 30 days) via stats.fm, rate-limited to one fetch/day
- Recently played Steam games via the Steam Web API
- Most recent League of Legends match via the Riot Games API
- Last-good-data fallback cache so widgets stay populated through upstream API failures
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

All API-backed widgets degrade gracefully (hidden or "unavailable") when their variables are unset.

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Optional — avoids GitHub API rate limits on the git log / top-projects widgets |
| `STEAM_API_KEY` | Steam Web API key |
| `STEAM_ID` | SteamID64 of the profile to read |
| `RIOT_API_KEY` | Riot Games API key |
| `RIOT_GAME_NAME` | Riot ID game name (before the `#`) |
| `RIOT_TAG_LINE` | Riot ID tag line (after the `#`) |
| `RIOT_REGION` | Riot routing region, e.g. `europe` (default) |
| `SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify app client secret |
| `SPOTIFY_REFRESH_TOKEN` | Spotify OAuth refresh token (see `scripts/spotify-get-refresh-token.mjs`) |
| `STATSFM_USER_ID` | stats.fm user ID, used for the top-artists widget |

---

## Customization

- **Personal info, contact, stack** → `content/profile.js`
- **Projects** → `content/projects.js`
