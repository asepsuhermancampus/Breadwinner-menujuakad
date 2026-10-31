/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { BaseRepository } from "./base";
import type { Guest, RSVP } from "@/generated/prisma/client";

export type GuestCreateInput = {
  workspaceId: string;
  eventId?: string;
  invitationId?: string;
  name: string;
  phone?: string;
  email?: string;
  side?: string;
  category?: string;
  dietary?: string;
  tableNumber?: number;
  seatNumber?: number;
  plusOne?: number;
};

export type GuestUpdateInput = {
  name?: string;
  phone?: string;
  email?: string;
  side?: string;
  category?: string;
  dietary?: string;
  tableNumber?: number;
  seatNumber?: number;
  plusOne?: number;
};

export type GuestFilter = {
  workspaceId?: string;
  eventId?: string;
  invitationId?: string;
  name?: string;
  side?: string;
  category?: string;
};

export class GuestRepository extends BaseRepository<
  Guest,
  GuestCreateInput,
  GuestUpdateInput,
  GuestFilter
> {
  protected modelName = "guest";

  protected mapCreateInput(input: GuestCreateInput): Record<string, unknown> {
    return {
      workspaceId: input.workspaceId,
      eventId: input.eventId,
      invitationId: input.invitationId,
      name: input.name,
      phone: input.phone,
      email: input.email,
      side: input.side,
      category: input.category,
      dietary: input.dietary,
      tableNumber: input.tableNumber,
      seatNumber: input.seatNumber,
      plusOne: input.plusOne ?? 0,
    };
  }

  protected mapUpdateInput(input: GuestUpdateInput): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.phone !== undefined) data.phone = input.phone;
    if (input.email !== undefined) data.email = input.email;
    if (input.side !== undefined) data.side = input.side;
    if (input.category !== undefined) data.category = input.category;
    if (input.dietary !== undefined) data.dietary = input.dietary;
    if (input.tableNumber !== undefined) data.tableNumber = input.tableNumber;
    if (input.seatNumber !== undefined) data.seatNumber = input.seatNumber;
    if (input.plusOne !== undefined) data.plusOne = input.plusOne;
    return data;
  }

  protected mapFilter(filter: GuestFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filter.workspaceId) where.workspaceId = filter.workspaceId;
    if (filter.eventId) where.eventId = filter.eventId;
    if (filter.invitationId) where.invitationId = filter.invitationId;
    if (filter.name) where.name = { contains: filter.name, mode: "insensitive" };
    if (filter.side) where.side = filter.side;
    if (filter.category) where.category = filter.category;
    return where;
  }

  protected includeRelations() {
    return {
      rsvps: true,
      event: true,
      invitation: true,
    };
  }

  async findByWorkspace(workspaceId: string): Promise<Guest[]> {
    return this.prisma.guest.findMany({
      where: { workspaceId },
      include: this.includeRelations(),
      orderBy: { name: "asc" },
    }) as Promise<Guest[]>;
  }

  async importFromCSV(workspaceId: string, guests: GuestCreateInput[]): Promise<Guest[]> {
    return this.prisma.$transaction(
      guests.map((guest) =>
        this.prisma.guest.create({
          data: this.mapCreateInput({ ...guest, workspaceId }) as Record<string, unknown>,
          include: this.includeRelations(),
        }),
      ),
    ) as Promise<Guest[]>;
  }

  async getRSVP(guestId: string, invitationId: string): Promise<RSVP | null> {
    return this.prisma.rSVP.findUnique({
      where: { invitationId_guestId: { invitationId, guestId } },
      include: { guest: true, invitation: true },
    }) as Promise<RSVP | null>;
  }

  async createRSVP(
    guestId: string,
    invitationId: string,
    status: "PENDING" | "CONFIRMED" | "DECLINED" = "PENDING",
  ): Promise<RSVP> {
    return this.prisma.rSVP.create({
      data: {
        guestId,
        invitationId,
        status,
        respondedAt: status !== "PENDING" ? new Date() : null,
      },
    }) as Promise<RSVP>;
  }

  async updateRSVP(
    guestId: string,
    invitationId: string,
    status: "PENDING" | "CONFIRMED" | "DECLINED",
  ): Promise<RSVP> {
    return this.prisma.rSVP.update({
      where: { invitationId_guestId: { invitationId, guestId } },
      data: {
        status,
        respondedAt: new Date(),
      },
    }) as Promise<RSVP>;
  }

  async getRSVPStats(
    workspaceId: string,
  ): Promise<{ total: number; confirmed: number; declined: number; pending: number }> {
    const guests = await this.prisma.guest.findMany({
      where: { workspaceId },
      include: { rsvps: true },
    });
    const rsvps = guests.flatMap((g) => g.rsvps);
    return {
      total: rsvps.length,
      confirmed: rsvps.filter((r) => r.status === "CONFIRMED").length,
      declined: rsvps.filter((r) => r.status === "DECLINED").length,
      pending: rsvps.filter((r) => r.status === "PENDING").length,
    };
  }
}
