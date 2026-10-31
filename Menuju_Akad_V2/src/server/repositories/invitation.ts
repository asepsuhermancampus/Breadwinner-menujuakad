import "server-only";
import { BaseRepository } from "./base";
import type { Invitation, Guest, RSVP } from "@/generated/prisma/client";

export type InvitationCreateInput = {
  workspaceId: string;
  eventId: string;
  slug: string;
  title: string;
  description?: string;
  templateId?: string;
  status?: "DRAFT" | "PUBLISHED" | "EXPIRED";
  expiresAt?: Date | string;
};

export type InvitationUpdateInput = {
  title?: string;
  description?: string;
  templateId?: string;
  status?: "DRAFT" | "PUBLISHED" | "EXPIRED";
  publishedAt?: Date | string;
  expiresAt?: Date | string;
};

export type InvitationFilter = {
  workspaceId?: string;
  eventId?: string;
  status?: string;
  slug?: string;
};

export class InvitationRepository extends BaseRepository<
  Invitation,
  InvitationCreateInput,
  InvitationUpdateInput,
  InvitationFilter
> {
  protected modelName = "invitation";

  protected mapCreateInput(input: InvitationCreateInput): Record<string, unknown> {
    return {
      workspaceId: input.workspaceId,
      eventId: input.eventId,
      slug: input.slug,
      title: input.title,
      description: input.description,
      templateId: input.templateId,
      status: input.status ?? "DRAFT",
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    };
  }

  protected mapUpdateInput(input: InvitationUpdateInput): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.templateId !== undefined) data.templateId = input.templateId;
    if (input.status !== undefined) data.status = input.status;
    if (input.publishedAt !== undefined)
      data.publishedAt = input.publishedAt ? new Date(input.publishedAt) : null;
    if (input.expiresAt !== undefined)
      data.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
    return data;
  }

  protected mapFilter(filter: InvitationFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filter.workspaceId) where.workspaceId = filter.workspaceId;
    if (filter.eventId) where.eventId = filter.eventId;
    if (filter.status) where.status = filter.status;
    if (filter.slug) where.slug = filter.slug;
    return where;
  }

  protected includeRelations() {
    return {
      guests: true,
      rsvps: true,
      template: true,
      event: true,
    };
  }

  async findBySlug(slug: string): Promise<Invitation | null> {
    return this.prisma.invitation.findUnique({
      where: { slug },
      include: this.includeRelations(),
    }) as Promise<Invitation | null>;
  }

  async publish(id: string): Promise<Invitation> {
    return this.update(id, {
      status: "PUBLISHED",
      publishedAt: new Date(),
    });
  }

  async getGuests(invitationId: string): Promise<Guest[]> {
    return this.prisma.guest.findMany({
      where: { invitationId },
      include: { rsvps: true },
    }) as Promise<Guest[]>;
  }

  async getRSVPs(invitationId: string): Promise<RSVP[]> {
    return this.prisma.rSVP.findMany({
      where: { invitationId },
      include: { guest: true },
    }) as Promise<RSVP[]>;
  }

  async getRSVPStats(
    invitationId: string,
  ): Promise<{ total: number; confirmed: number; declined: number; pending: number }> {
    const rsvps = await this.prisma.rSVP.findMany({
      where: { invitationId },
    });
    return {
      total: rsvps.length,
      confirmed: rsvps.filter((r) => r.status === "CONFIRMED").length,
      declined: rsvps.filter((r) => r.status === "DECLINED").length,
      pending: rsvps.filter((r) => r.status === "PENDING").length,
    };
  }
}
