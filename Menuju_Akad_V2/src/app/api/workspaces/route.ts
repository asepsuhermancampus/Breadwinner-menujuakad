import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { getWorkspaceRepository } from "@/server/repositories/runtime";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const repo = getWorkspaceRepository();
  const workspaces = await repo.findMany({});
  return NextResponse.json({ workspaces });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, slug } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
  }

  const repo = getWorkspaceRepository();
  const existing = await repo.findBySlug(slug);
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const workspace = await repo.create({ name, slug, status: "ACTIVE" });
  await repo.addMember(workspace.id, user.id, "OWNER");

  return NextResponse.json({ workspace }, { status: 201 });
}
