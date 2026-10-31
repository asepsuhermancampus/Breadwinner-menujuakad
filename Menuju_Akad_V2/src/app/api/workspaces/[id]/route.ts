import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { getWorkspaceRepository } from "@/server/repositories/runtime";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const repo = getWorkspaceRepository();
  const workspace = await repo.findById(id);
  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ workspace });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const repo = getWorkspaceRepository();

  const workspace = await repo.findById(id);
  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const members = await repo.getMembers(id);
  const isOwner = members.some((m) => m.userId === user.id && m.role === "OWNER");
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await repo.update(id, body);
  return NextResponse.json({ workspace: updated });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const repo = getWorkspaceRepository();

  const workspace = await repo.findById(id);
  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const members = await repo.getMembers(id);
  const isOwner = members.some((m) => m.userId === user.id && m.role === "OWNER");
  if (!isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await repo.delete(id);
  return NextResponse.json({ success: true });
}
