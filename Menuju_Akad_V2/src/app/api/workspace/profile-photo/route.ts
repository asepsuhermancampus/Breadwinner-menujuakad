import { getWorkspaceService } from "@/server/workspaces/runtime";
import {
  requireAuthOwner,
  validateSameOrigin,
  jsonResponse,
  handlePaymentApiError,
} from "@/server/payments/http";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { PaymentError } from "@/server/payments/errors";
import {
  profilePhotoSlot,
  readProfilePhoto,
  writeProfilePhoto,
} from "@/server/workspaces/profile-photo-storage";
import {
  MAX_PROFILE_PHOTO_BODY,
  sanitizeProfilePhoto,
} from "@/server/workspaces/profile-photo-image";

export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const params = new URL(req.url).searchParams,
      service = getWorkspaceService();
    const workspace = service.requireWorkspace(auth.owner, params.get("workspace") ?? undefined);
    const slot = profilePhotoSlot(params.get("slot"));
    if (slot === "partner" && workspace.partnerAccess?.state !== "connected")
      throw new PaymentError("Foto tidak ditemukan", 404);
    const image = readProfilePhoto(service.db, workspace.id, slot);
    return new Response(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(image.length),
        "Cache-Control": "private, no-cache",
        "X-Content-Type-Options": "nosniff",
        Vary: "Cookie",
        "Content-Disposition": "inline; filename=profile.jpg",
      },
    });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}

async function mutate(req: Request, remove: boolean) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const params = new URL(req.url).searchParams,
      service = getWorkspaceService();
    const workspace = service.requireWorkspace(auth.owner, params.get("workspace") ?? undefined);
    const ownSlot = workspace.role === "owner" ? "owner" : "partner";
    const assertSlot = (slot: string, current = workspace) => {
      if (slot === ownSlot) return;
      if (current.partnerAccess?.state === "connected") return;
      throw new PaymentError("Foto pasangan hanya dapat diatur setelah terhubung", 403);
    };
    if (remove) {
      const slot = profilePhotoSlot(params.get("slot"));
      assertSlot(slot);
      writeProfilePhoto(service.db, workspace.id, slot, null);
    } else {
      const body = await readBoundedJson(req, MAX_PROFILE_PHOTO_BODY);
      if (Object.keys(body).some((key) => !["slot", "dataUrl"].includes(key)))
        throw new PaymentError("Foto profil tidak valid", 400);
      const slot = profilePhotoSlot(body["slot"]);
      assertSlot(slot);
      const image = await sanitizeProfilePhoto(body["dataUrl"]);
      assertSlot(slot, service.requireWorkspace(auth.owner, workspace.id));
      writeProfilePhoto(service.db, workspace.id, slot, image);
    }
    return jsonResponse({ workspace: service.requireWorkspace(auth.owner, workspace.id) });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
export async function PUT(req: Request) {
  return mutate(req, false);
}
export async function DELETE(req: Request) {
  return mutate(req, true);
}
