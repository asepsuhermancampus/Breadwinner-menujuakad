import { z } from "zod";
const person = z.object({
  fullName: z.string(),
  nickname: z.string(),
  father: z.string(),
  mother: z.string(),
  photoUrl: z.string().nullable(),
});
const event = z.object({
  id: z.string(),
  kind: z.enum(["engagement", "wedding"]),
  date: z.string(),
  city: z.string(),
  venue: z.string(),
  address: z.string(),
  budgetIdr: z.number().int().nonnegative(),
  guestEstimate: z.number().int().nonnegative(),
});
export const workspaceStorageSchema = z.object({
  workspaceId: z.string(),
  actorId: z.string(),
  version: z.number().int().positive(),
  profile: z.object({
    groom: person,
    bride: person,
    culture: z.string(),
    actorRole: z.enum(["bride", "groom"]),
  }),
  scope: z.enum(["engagement", "wedding", "both"]),
  events: z.object({ engagement: event, wedding: event }),
  invite: z
    .object({
      token: z.string(),
      workspaceId: z.string(),
      ownerId: z.string(),
      expiresAt: z.number(),
      status: z.enum(["pending", "revoked", "used"]),
      redeemedBy: z.string().nullable(),
    })
    .nullable(),
  members: z.array(
    z.object({
      actorId: z.string(),
      workspaceId: z.string(),
      role: z.enum(["owner", "partner"]),
    }),
  ),
});
export const accountStorageSchema = z.object({
  profile: z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    culture: z.string(),
    roleLabel: z.string(),
    version: z.number().int(),
  }),
  partner: z
    .object({
      id: z.string(),
      fullName: z.string(),
      nickname: z.string(),
      email: z.string(),
      roleLabel: z.string(),
      accessLabel: z.string(),
      connected: z.boolean(),
      version: z.number().int(),
    })
    .nullable(),
  preferences: z.object({
    inApp: z.boolean(),
    email: z.boolean(),
    whatsApp: z.boolean(),
    reducedMotion: z.boolean(),
    partnerSync: z.boolean(),
    discoverable: z.boolean(),
    version: z.number().int(),
  }),
  sessions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      location: z.string(),
      lastActive: z.string(),
      current: z.boolean(),
    }),
  ),
  entitlement: z.object({
    plan: z.enum(["free", "premium", "lifetime"]),
    expiresAt: z.string().nullable(),
  }),
  memberships: z.array(z.object({ id: z.string(), label: z.string(), detail: z.string() })),
  asOf: z.string(),
  verificationHint: z.string().optional(),
  invoices: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        date: z.string(),
        amountIdr: z.number().int().nonnegative(),
        status: z.enum(["paid", "pending", "expired"]),
      }),
    )
    .optional(),
});
