import { NextResponse } from "next/server";

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

export async function GET() {
  if (!API_KEY || !STEAM_ID) {
    return NextResponse.json({ error: true });
  }

  try {
    const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/");
    url.searchParams.set("key", API_KEY);
    url.searchParams.set("steamid", STEAM_ID);
    url.searchParams.set("include_appinfo", "1");
    url.searchParams.set("include_played_free_games", "1");
    url.searchParams.set("format", "json");

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`owned-games ${res.status}`);

    const data = await res.json();
    const games = (data.response?.games || [])
      .filter((g) => g.rtime_last_played)
      .sort((a, b) => b.rtime_last_played - a.rtime_last_played)
      .slice(0, 5)
      .map((g) => ({
        name: g.name,
        hours: Math.round(g.playtime_forever / 60),
      }));

    if (!games.length) return NextResponse.json({ error: true });

    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ error: true });
  }
}
