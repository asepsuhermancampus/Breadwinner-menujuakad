import "server-only";
import { BaseRepository } from "./base";
import type { Event } from "@/generated/prisma/client";

export type EventCreateInput = {
  workspaceId: string;
  name: string;
  date?: Date | string;
  location?: string;
  type?: string;
};

export type EventUpdateInput = {
  name?: string;
  date?: Date | string;
  location?: string;
  type?: string;
};

export type EventFilter = {
  workspaceId?: string;
  name?: string;
  type?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
};

export class EventRepository extends BaseRepository<
  Event,
  EventCreateInput,
  EventUpdateInput,
  EventFilter
> {
  protected modelName = "event";

  protected mapCreateInput(input: EventCreateInput): Record<string, unknown> {
    return {
      workspaceId: input.workspaceId,
      name: input.name,
      date: input.date ? new Date(input.date) : null,
      location: input.location,
      type: input.type,
    };
  }

  protected mapUpdateInput(input: EventUpdateInput): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.date !== undefined) data.date = input.date ? new Date(input.date) : null;
    if (input.location !== undefined) data.location = input.location;
    if (input.type !== undefined) data.type = input.type;
    return data;
  }

  protected mapFilter(filter: EventFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filter.workspaceId) where.workspaceId = filter.workspaceId;
    if (filter.name) where.name = { contains: filter.name, mode: "insensitive" };
    if (filter.type) where.type = filter.type;
    if (filter.dateFrom || filter.dateTo) {
      where.date = {
        ...(filter.dateFrom ? { gte: new Date(filter.dateFrom) } : {}),
        ...(filter.dateTo ? { lte: new Date(filter.dateTo) } : {}),
      };
    }
    return where;
  }

  protected includeRelations() {
    return {
      invitations: true,
      guests: true,
      tasks: true,
      calendarEvents: true,
      rundowns: true,
      expenses: true,
      documents: true,
    };
  }

  async findByWorkspace(workspaceId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { workspaceId },
      include: this.includeRelations(),
      orderBy: { date: "asc" },
    }) as Promise<Event[]>;
  }

  async getUpcoming(workspaceId: string, limit = 10): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        workspaceId,
        date: { gte: new Date() },
      },
      include: this.includeRelations(),
      orderBy: { date: "asc" },
      take: limit,
    }) as Promise<Event[]>;
  }

  async getPast(workspaceId: string, limit = 10): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        workspaceId,
        date: { lt: new Date() },
      },
      include: this.includeRelations(),
      orderBy: { date: "desc" },
      take: limit,
    }) as Promise<Event[]>;
  }
}
