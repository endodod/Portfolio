import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

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
      { headers, next: { revalidate: 3600 } }
    );
    if (!artistsRes.ok) throw new Error(`top-artists ${artistsRes.status}`);

    const artistsData = await artistsRes.json();

    const artists = (artistsData.items || []).map((artist) => ({
      name: artist.name,
      url: artist.external_urls?.spotify || null,
    }));

    if (!artists.length) return NextResponse.json({ error: true });

    return NextResponse.json({ artists });
  } catch {
    return NextResponse.json({ error: true });
  }
}
