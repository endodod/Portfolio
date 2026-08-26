import { NextResponse } from "next/server";
import { getLastGood, setLastGood } from "@/lib/lastGoodCache";

const API_KEY = process.env.RIOT_API_KEY;
const GAME_NAME = process.env.RIOT_GAME_NAME;
const TAG_LINE = process.env.RIOT_TAG_LINE;
const REGION = process.env.RIOT_REGION || "europe";
const CACHE_KEY = "riot-recent";

const OPGG_REGION_BY_CONTINENT = { europe: "euw", americas: "na", asia: "kr", sea: "sg" };
const OPGG_REGION = process.env.RIOT_OPGG_REGION || OPGG_REGION_BY_CONTINENT[REGION] || "euw";

const PLATFORM_BY_CONTINENT = { europe: "euw1", americas: "na1", asia: "kr", sea: "sg2" };
const PLATFORM = process.env.RIOT_PLATFORM || PLATFORM_BY_CONTINENT[REGION] || "euw1";

const CHAMPION_NAMES_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json";

async function getChampionNameById() {
  const res = await fetch(CHAMPION_NAMES_URL, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`champion-summary ${res.status}`);
  const champions = await res.json();
  return new Map(champions.map((c) => [c.id, c.name]));
}

export async function GET() {
  if (!API_KEY || !GAME_NAME || !TAG_LINE) {
    return NextResponse.json({ error: true });
  }

  try {
    const headers = { "X-Riot-Token": API_KEY };

    const accountRes = await fetch(
      `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(GAME_NAME)}/${encodeURIComponent(TAG_LINE)}`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!accountRes.ok) throw new Error(`account ${accountRes.status}`);
    const { puuid, gameName, tagLine } = await accountRes.json();

    const masteryRes = await fetch(
      `https://${PLATFORM}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=5`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!masteryRes.ok) throw new Error(`champion-mastery ${masteryRes.status}`);
    const masteries = await masteryRes.json();

    if (!masteries.length) throw new Error("no champion masteries");

    const championNameById = await getChampionNameById();

    const champions = masteries.map((m) => ({
      name: championNameById.get(m.championId) || `Champion ${m.championId}`,
      points: m.championPoints,
    }));

    const account = {
      name: `${gameName}#${tagLine}`,
      url: `https://www.op.gg/summoners/${OPGG_REGION}/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`,
    };

    const result = { champions, account };
    setLastGood(CACHE_KEY, result);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(getLastGood(CACHE_KEY) || { error: true });
  }
}
