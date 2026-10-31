import "server-only";
import { getDatabase } from "@/server/db/client";
import { WorkspaceRepository } from "./repositories/workspace";

let workspaceRepositoryInstance: WorkspaceRepository | null = null;

export function getWorkspaceRepository(): WorkspaceRepository {
  if (!workspaceRepositoryInstance) {
    const db = getDatabase();
    workspaceRepositoryInstance = new WorkspaceRepository();
  }
  return workspaceRepositoryInstance;
}
