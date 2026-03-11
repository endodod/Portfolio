import { NextResponse } from "next/server";

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USER || process.env.GITHUB_USER || "endodod";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET() {
  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-site",
    };
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events?per_page=30`,
      { headers, next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const events = await res.json();

    const commits = [];
    for (const ev of events) {
      if (ev.type === "PushEvent" && ev.payload?.commits) {
        for (const c of [...ev.payload.commits].reverse()) {
          const hash = c.sha?.slice(0, 7) || "0000000";
          const msg = c.message?.split("\n")[0]?.slice(0, 38) || "commit";
          commits.push(`${hash} ${msg}`);
          if (commits.length >= 5) break;
        }
      }
      if (commits.length >= 5) break;
    }

    if (commits.length === 0) commits.push("(no recent activity)");
    return NextResponse.json({ commits });
  } catch {
    return NextResponse.json({ commits: ["(git log unavailable)"] }, { status: 200 });
  }
}
