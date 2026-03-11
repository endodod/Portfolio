import { NextResponse } from "next/server";
import { profile } from "@/content/profile";

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USER || process.env.GITHUB_USER || profile.contact.github_user;
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

    // Find the most recently pushed-to repo via events
    const evRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events?per_page=10`,
      { headers, next: { revalidate: 60 } }
    );
    if (!evRes.ok) throw new Error(`GitHub API ${evRes.status}`);
    const events = await evRes.json();

    const pushEvent = events.find((ev) => ev.type === "PushEvent" && ev.repo?.name);
    const repoName = pushEvent?.repo?.name || `${GITHUB_USER}/Portfolio`;

    // Fetch commits from that repo directly
    const commitsRes = await fetch(
      `https://api.github.com/repos/${repoName}/commits?per_page=5`,
      { headers, next: { revalidate: 60 } }
    );
    if (!commitsRes.ok) throw new Error(`GitHub commits API ${commitsRes.status}`);
    const data = await commitsRes.json();

    const commits = data.map((c) => {
      const hash = c.sha?.slice(0, 7) || "0000000";
      const msg = c.commit?.message?.split("\n")[0]?.slice(0, 38) || "commit";
      return `${hash} ${msg}`;
    });

    if (commits.length === 0) commits.push("(no recent activity)");
    return NextResponse.json({ commits });
  } catch {
    return NextResponse.json({ commits: ["(git log unavailable)"] }, { status: 200 });
  }
}
