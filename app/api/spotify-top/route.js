import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
const STATSFM_USER_ID = process.env.STATSFM_USER_ID;

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return NextResponse.json({ error: true });
  }

  try {
    const accessToken = await getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    const artistsRes = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5",
      { headers, next: { revalidate: 86400 } }
    );
    if (!artistsRes.ok) throw new Error(`top-artists ${artistsRes.status}`);

    const artistsData = await artistsRes.json();

    const trackCounts = new Map();
    const tracksRes = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
      { headers, next: { revalidate: 86400 } }
    );
    if (tracksRes.ok) {
      const tracksData = await tracksRes.json();
      for (const track of tracksData.items || []) {
        for (const artist of track.artists || []) {
          trackCounts.set(artist.id, (trackCounts.get(artist.id) || 0) + 1);
        }
      }
    }

    const artists = (artistsData.items || []).map((artist) => ({
      id: artist.id,
      name: artist.name,
      url: artist.external_urls?.spotify || null,
      tracks: trackCounts.get(artist.id) || 0,
    }));

    if (!artists.length) return NextResponse.json({ error: true });

    if (STATSFM_USER_ID) {
      try {
        const thirtyDaysAgoMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const statsfmRes = await fetch(
          `https://api.stats.fm/api/v1/users/${encodeURIComponent(STATSFM_USER_ID)}/top/artists?after=${thirtyDaysAgoMs}`,
          { next: { revalidate: 86400 } }
        );
        if (statsfmRes.ok) {
          const statsfmData = await statsfmRes.json();
          const msBySpotifyId = new Map();
          for (const item of statsfmData.items || []) {
            for (const spotifyId of item.artist?.externalIds?.spotify || []) {
              msBySpotifyId.set(spotifyId, item.playedMs || 0);
            }
          }
          for (const artist of artists) {
            const ms = msBySpotifyId.get(artist.id);
            if (ms) artist.hours = Math.round((ms / 3600000) * 10) / 10;
          }
        }
      } catch {
        // stats.fm unavailable — artists keep their track counts as a fallback
      }
    }

    artists.sort((a, b) => (b.hours || 0) - (a.hours || 0) || b.tracks - a.tracks);

    const artistsOut = artists.map(({ id, ...rest }) => rest);

    let account = null;
    const meRes = await fetch("https://api.spotify.com/v1/me", {
      headers,
      next: { revalidate: 86400 },
    });
    if (meRes.ok) {
      const me = await meRes.json();
      account = { name: me.display_name || me.id, url: me.external_urls?.spotify || null };
    }

    return NextResponse.json({ artists: artistsOut, account });
  } catch {
    return NextResponse.json({ error: true });
  }
}
