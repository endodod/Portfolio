import { execSync } from "child_process";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const projectRoot = path.resolve(process.cwd());
    const output = execSync("git log -5 --oneline", {
      cwd: projectRoot,
      encoding: "utf-8",
    });
    const lines = output.trim().split("\n").filter(Boolean);
    return NextResponse.json({ commits: lines });
  } catch {
    return NextResponse.json(
      { commits: ["(git log unavailable)"] },
      { status: 200 }
    );
  }
}
