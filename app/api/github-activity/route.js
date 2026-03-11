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
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events?per_page=30`,
      { headers, next: { revalidate: 300 } }
    );
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status}`);
    }
    const events = await res.json();
    const activity = parseLatestActivity(events);
    return NextResponse.json(activity);
  } catch (err) {
    return NextResponse.json(
      { repo: null, message: null, error: true },
      { status: 200 }
    );
  }
}

function parseLatestActivity(events) {
  for (const ev of events) {
    if (ev.type === "PushEvent" && ev.repo?.name) {
      const commits = ev.payload?.commits || [];
      const last = commits[commits.length - 1];
      const message = last?.message?.split("\n")[0]?.trim() || "pushed changes";
      return { repo: ev.repo.name, message };
    }
    if (ev.type === "PullRequestEvent" && ev.payload?.pull_request && ev.repo?.name) {
      const pr = ev.payload.pull_request;
      const action = ev.payload.action;
      const title = pr.title || "pull request";
      return { repo: ev.repo.name, message: `${action} PR: ${title}` };
    }
  }
  return { repo: null, message: null };
}
