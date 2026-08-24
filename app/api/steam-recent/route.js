import { NextResponse } from "next/server";
import { getLastGood, setLastGood } from "@/lib/lastGoodCache";

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;
const CACHE_KEY = "steam-recent";

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
      .filter((g) => g.playtime_2weeks > 0)
      .sort((a, b) => b.playtime_2weeks - a.playtime_2weeks)
      .slice(0, 5)
      .map((g) => ({
        name: g.name,
        hours: Math.round(g.playtime_2weeks / 60),
      }));

    if (!games.length) throw new Error("no recent games");

    let account = null;
    const summaryUrl = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/");
    summaryUrl.searchParams.set("key", API_KEY);
    summaryUrl.searchParams.set("steamids", STEAM_ID);
    const summaryRes = await fetch(summaryUrl, { next: { revalidate: 3600 } });
    if (summaryRes.ok) {
      const summaryData = await summaryRes.json();
      const player = summaryData.response?.players?.[0];
      if (player) account = { name: player.personaname, url: player.profileurl };
    }

    const result = { games, account };
    setLastGood(CACHE_KEY, result);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(getLastGood(CACHE_KEY) || { error: true });
  }
}
