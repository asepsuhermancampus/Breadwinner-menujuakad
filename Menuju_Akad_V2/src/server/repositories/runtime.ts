import "server-only";
import { WorkspaceRepository } from "./workspace";

let workspaceRepositoryInstance: WorkspaceRepository | null = null;

export function getWorkspaceRepository(): WorkspaceRepository {
  if (!workspaceRepositoryInstance) {
    workspaceRepositoryInstance = new WorkspaceRepository();
  }
  return workspaceRepositoryInstance;
}
