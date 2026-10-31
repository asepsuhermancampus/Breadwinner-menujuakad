"use server";

import { revalidatePath } from "next/cache";
import { getWorkspaceRepository } from "@/server/repositories/runtime";
import { getCurrentUser } from "@/server/auth/session";

export async function createWorkspace(data: { name: string; slug: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  const existing = await repo.findBySlug(data.slug);
  if (existing) throw new Error("Slug sudah digunakan");

  const workspace = await repo.create({
    name: data.name,
    slug: data.slug,
    status: "ACTIVE",
  });

  await repo.addMember(workspace.id, user.id, "OWNER");

  revalidatePath("/dashboard");
  return workspace;
}

export async function updateWorkspace(
  workspaceId: string,
  data: { name?: string; slug?: string; status?: "ACTIVE" | "ARCHIVED" | "SUSPENDED" },
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  const workspace = await repo.findById(workspaceId);
  if (!workspace) throw new Error("Workspace tidak ditemukan");

  const members = await repo.getMembers(workspaceId);
  const isOwner = members.some((m) => m.userId === user.id && m.role === "OWNER");
  if (!isOwner) throw new Error("Forbidden");

  const updated = await repo.update(workspaceId, data);
  revalidatePath("/dashboard");
  revalidatePath(`/workspace/${workspaceId}`);
  return updated;
}

export async function deleteWorkspace(workspaceId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  const workspace = await repo.findById(workspaceId);
  if (!workspace) throw new Error("Workspace tidak ditemukan");

  const members = await repo.getMembers(workspaceId);
  const isOwner = members.some((m) => m.userId === user.id && m.role === "OWNER");
  if (!isOwner) throw new Error("Forbidden");

  await repo.delete(workspaceId);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getWorkspace(workspaceId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  return repo.findById(workspaceId);
}

export async function getUserWorkspaces() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  return repo.findMany({ userId: user.id });
}

export async function inviteMember(
  workspaceId: string,
  userId: string,
  role: "OWNER" | "PARTNER" = "PARTNER",
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  const workspace = await repo.findById(workspaceId);
  if (!workspace) throw new Error("Workspace tidak ditemukan");

  const members = await repo.getMembers(workspaceId);
  const isOwner = members.some((m) => m.userId === user.id && m.role === "OWNER");
  if (!isOwner) throw new Error("Forbidden");

  return repo.addMember(workspaceId, userId, role);
}

export async function removeMember(workspaceId: string, userId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  const workspace = await repo.findById(workspaceId);
  if (!workspace) throw new Error("Workspace tidak ditemukan");

  const members = await repo.getMembers(workspaceId);
  const isOwner = members.some((m) => m.userId === user.id && m.role === "OWNER");
  if (!isOwner) throw new Error("Forbidden");

  await repo.removeMember(workspaceId, userId);
  revalidatePath(`/workspace/${workspaceId}/members`);
  return { success: true };
}

export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  role: "OWNER" | "PARTNER",
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const repo = getWorkspaceRepository();
  const workspace = await repo.findById(workspaceId);
  if (!workspace) throw new Error("Workspace tidak ditemukan");

  const members = await repo.getMembers(workspaceId);
  const isOwner = members.some((m) => m.userId === user.id && m.role === "OWNER");
  if (!isOwner) throw new Error("Forbidden");

  return repo.updateMemberRole(workspaceId, userId, role);
}
