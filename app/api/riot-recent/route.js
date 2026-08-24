import { NextResponse } from "next/server";

const API_KEY = process.env.RIOT_API_KEY;
const GAME_NAME = process.env.RIOT_GAME_NAME;
const TAG_LINE = process.env.RIOT_TAG_LINE;
const REGION = process.env.RIOT_REGION || "europe";

export async function GET() {
  if (!API_KEY || !GAME_NAME || !TAG_LINE) {
    return NextResponse.json({ error: true });
  }

  try {
    const headers = { "X-Riot-Token": API_KEY };

    const accountRes = await fetch(
      `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(GAME_NAME)}/${encodeURIComponent(TAG_LINE)}`,
      { headers, next: { revalidate: 900 } }
    );
    if (!accountRes.ok) throw new Error(`account ${accountRes.status}`);
    const { puuid } = await accountRes.json();

    const idsRes = await fetch(
      `https://${REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`,
      { headers, next: { revalidate: 900 } }
    );
    if (!idsRes.ok) throw new Error(`match-ids ${idsRes.status}`);
    const matchIds = await idsRes.json();

    const matches = await Promise.all(
      matchIds.map((id) =>
        fetch(`https://${REGION}.api.riotgames.com/lol/match/v5/matches/${id}`, {
          headers,
          next: { revalidate: 900 },
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );

    const champions = [];
    for (const match of matches) {
      const participant = match?.info?.participants?.find((p) => p.puuid === puuid);
      const champ = participant?.championName;
      if (champ && !champions.includes(champ)) champions.push(champ);
      if (champions.length >= 5) break;
    }

    if (!champions.length) return NextResponse.json({ error: true });

    return NextResponse.json({ champions });
  } catch {
    return NextResponse.json({ error: true });
  }
}
