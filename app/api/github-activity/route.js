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

    // Find most recent PushEvent to get the repo
    const evRes = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events?per_page=10`,
      { headers, next: { revalidate: 300 } }
    );
    if (!evRes.ok) throw new Error(`GitHub API ${evRes.status}`);
    const events = await evRes.json();

    // Check for PR events first (payload still intact for those)
    for (const ev of events) {
      if (ev.type === "PullRequestEvent" && ev.payload?.pull_request && ev.repo?.name) {
        const pr = ev.payload.pull_request;
        const action = ev.payload.action;
        const title = pr.title || "pull request";
        return NextResponse.json({ repo: ev.repo.name, message: `${action} PR: ${title}` });
      }
    }

    // Fall back to most recent PushEvent — fetch the head commit for the message
    const pushEvent = events.find((ev) => ev.type === "PushEvent" && ev.repo?.name && ev.payload?.head);
    if (pushEvent) {
      const { name: repoName } = pushEvent.repo;
      const headSha = pushEvent.payload.head;
      const commitRes = await fetch(
        `https://api.github.com/repos/${repoName}/commits/${headSha}`,
        { headers, next: { revalidate: 300 } }
      );
      if (commitRes.ok) {
        const commit = await commitRes.json();
        const message = commit.commit?.message?.split("\n")[0]?.trim() || "pushed changes";
        return NextResponse.json({ repo: repoName, message });
      }
    }

    return NextResponse.json({ repo: null, message: null });
  } catch {
    return NextResponse.json({ repo: null, message: null, error: true }, { status: 200 });
  }
}
