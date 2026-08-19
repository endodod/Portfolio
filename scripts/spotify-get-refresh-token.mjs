// One-off helper: exchange a Spotify authorization code for a refresh token.
//
// 1. Fill CLIENT_ID / CLIENT_SECRET in .env, then run this script once to print
//    the authorize URL:
//      node scripts/spotify-get-refresh-token.mjs
// 2. Open the printed URL, log in, approve access. Spotify redirects you to
//    http://127.0.0.1:3000/callback?code=... — the page load will fail (nothing
//    is listening there), that's fine. Copy the `code` value from the address bar.
// 3. Run again with the code to get your refresh token:
//      node scripts/spotify-get-refresh-token.mjs <code>

import { readFileSync } from "node:fs";

function loadEnv() {
  try {
    const text = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) process.env[match[1]] ||= match[2].trim();
    }
  } catch {
    // no .env file — rely on process env
  }
}

loadEnv();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:3000/callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.");
  process.exit(1);
}

const code = process.argv[2];

if (!code) {
  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", "user-top-read");
  console.log("Open this URL, log in, and approve access:\n");
  console.log(url.toString());
  console.log("\nThen copy the `code` param from the redirected URL and run:");
  console.log("  node scripts/spotify-get-refresh-token.mjs <code>");
  process.exit(0);
}

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

const res = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  }),
});

const data = await res.json();

if (!res.ok) {
  console.error("Token exchange failed:", data);
  process.exit(1);
}

console.log("\nAdd this to your .env:\n");
console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
