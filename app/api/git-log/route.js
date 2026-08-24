import { NextResponse } from "next/server";
import { profile } from "@/content/profile";

const GITHUB_USER = process.env.NEXT_PUBLIC_GITHUB_USER || process.env.GITHUB_USER || profile.contact.github_user;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = `${GITHUB_USER}/Portfolio`;

export async function GET() {
  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-site",
    };
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const repoName = GITHUB_REPO;

    // Fetch commits from that repo directly
    const commitsRes = await fetch(
      `https://api.github.com/repos/${repoName}/commits?per_page=5`,
      { headers, next: { revalidate: 60 } }
    );
    if (!commitsRes.ok) throw new Error(`GitHub commits API ${commitsRes.status}`);
    const data = await commitsRes.json();

    const commits = data.map((c) => {
      const hash = c.sha?.slice(0, 7) || "0000000";
      const msg = c.commit?.message?.split("\n")[0] || "commit";
      return `${hash} ${msg}`;
    });

    if (commits.length === 0) commits.push("(no recent activity)");
    return NextResponse.json({ commits });
  } catch {
    return NextResponse.json({ commits: ["(git log unavailable)"] }, { status: 200 });
  }
}
