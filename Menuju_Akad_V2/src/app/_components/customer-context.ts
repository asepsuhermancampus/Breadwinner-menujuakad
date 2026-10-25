import "server-only";
import { auth } from "@/server/auth";
import { ownerForSession } from "@/server/identity/policy";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
export async function customerContext() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return {
    workspace: await activeWorkspace(ownerForSession(session)),
    user: session.user,
  };
}
