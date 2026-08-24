import { NextResponse } from "next/server";

const API_KEY = process.env.RIOT_API_KEY;
const GAME_NAME = process.env.RIOT_GAME_NAME;
const TAG_LINE = process.env.RIOT_TAG_LINE;
const REGION = process.env.RIOT_REGION || "europe";

const OPGG_REGION_BY_CONTINENT = { europe: "euw", americas: "na", asia: "kr", sea: "sg" };
const OPGG_REGION = process.env.RIOT_OPGG_REGION || OPGG_REGION_BY_CONTINENT[REGION] || "euw";

export async function GET() {
  if (!API_KEY || !GAME_NAME || !TAG_LINE) {
    return NextResponse.json({ error: true });
  }

  try {
    const headers = { "X-Riot-Token": API_KEY };

    const accountRes = await fetch(
      `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(GAME_NAME)}/${encodeURIComponent(TAG_LINE)}`,
      { headers, next: { revalidate: 86400 } }
    );
    if (!accountRes.ok) throw new Error(`account ${accountRes.status}`);
    const { puuid, gameName, tagLine } = await accountRes.json();

    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

    const idsRes = await fetch(
      `https://${REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${thirtyDaysAgo}&start=0&count=50`,
      { headers, next: { revalidate: 86400 } }
    );
    if (!idsRes.ok) throw new Error(`match-ids ${idsRes.status}`);
    const matchIds = await idsRes.json();

    const matches = await Promise.all(
      matchIds.map((id) =>
        fetch(`https://${REGION}.api.riotgames.com/lol/match/v5/matches/${id}`, {
          headers,
          next: { revalidate: 86400 },
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );

    const champCounts = new Map();
    for (const match of matches) {
      const participant = match?.info?.participants?.find((p) => p.puuid === puuid);
      const champ = participant?.championName;
      if (champ) champCounts.set(champ, (champCounts.get(champ) || 0) + 1);
    }

    const champions = [...champCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, games]) => ({ name, games }));

    if (!champions.length) return NextResponse.json({ error: true });

    const account = {
      name: `${gameName}#${tagLine}`,
      url: `https://www.op.gg/summoners/${OPGG_REGION}/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`,
    };

    return NextResponse.json({ champions, account });
  } catch {
    return NextResponse.json({ error: true });
  }
}
