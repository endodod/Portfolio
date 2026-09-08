import { NextResponse } from "next/server";
import { projects } from "@/content/projects";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function parseLastPage(linkHeader) {
  if (!linkHeader) return null;
  const match = linkHeader.match(/[?&]page=(\d+)[^,]*>;\s*rel="last"/);
  return match ? parseInt(match[1], 10) : null;
}

async function getCommitCount(repoFullName, headers) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?per_page=1`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return 0;
    const lastPage = parseLastPage(res.headers.get("link"));
    if (lastPage) return lastPage;
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

function repoNames(project) {
  if (project.repos?.length) return project.repos.map((r) => r.github.replace(/^github\.com\//, ""));
  if (project.github) return [project.github.replace(/^github\.com\//, "")];
  return [];
}

export async function GET() {
  try {
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-site",
    };
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

    const withCommits = await Promise.all(
      projects.map(async (p) => {
        const repos = repoNames(p);
        const counts = await Promise.all(repos.map((r) => getCommitCount(r, headers)));
        return { name: p.name, commits: counts.reduce((sum, c) => sum + c, 0) };
      })
    );

    const top = withCommits
      .filter((p) => p.commits > 0)
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 5);

    if (!top.length) return NextResponse.json({ error: true });

    return NextResponse.json({ projects: top });
  } catch {
    return NextResponse.json({ error: true });
  }
}
