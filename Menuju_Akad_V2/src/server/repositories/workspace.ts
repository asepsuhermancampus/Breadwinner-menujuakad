import "server-only";
import { BaseRepository } from "./base";
import type {
  Workspace,
  Membership,
  Event,
  Task,
  CalendarEvent,
  Rundown,
  Checklist,
  BudgetCategory,
  Expense,
  VendorRequest,
  Guest,
  Review,
  Notification,
  AuditLog,
} from "@/generated/prisma/client";

export type WorkspaceCreateInput = {
  name: string;
  slug: string;
  status?: "ACTIVE" | "ARCHIVED" | "SUSPENDED";
};

export type WorkspaceUpdateInput = {
  name?: string;
  slug?: string;
  status?: "ACTIVE" | "ARCHIVED" | "SUSPENDED";
};

export type WorkspaceFilter = {
  status?: string;
  name?: string;
  slug?: string;
};

export class WorkspaceRepository extends BaseRepository<
  Workspace,
  WorkspaceCreateInput,
  WorkspaceUpdateInput,
  WorkspaceFilter
> {
  protected modelName = "workspace";

  protected mapCreateInput(input: WorkspaceCreateInput): Record<string, unknown> {
    return {
      name: input.name,
      slug: input.slug,
      status: input.status ?? "ACTIVE",
    };
  }

  protected mapUpdateInput(input: WorkspaceUpdateInput): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.slug !== undefined) data.slug = input.slug;
    if (input.status !== undefined) data.status = input.status;
    return data;
  }

  protected mapFilter(filter: WorkspaceFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {};
    if (filter.status) where.status = filter.status;
    if (filter.name) where.name = { contains: filter.name, mode: "insensitive" };
    if (filter.slug) where.slug = filter.slug;
    return where;
  }

  protected includeRelations() {
    return {
      members: true,
      events: true,
    };
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({
      where: { slug },
      include: this.includeRelations(),
    }) as Promise<Workspace | null>;
  }

  async findByName(name: string): Promise<Workspace | null> {
    return this.prisma.workspace.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      include: this.includeRelations(),
    }) as Promise<Workspace | null>;
  }

  async getMembers(workspaceId: string): Promise<Membership[]> {
    return this.prisma.membership.findMany({
      where: { workspaceId },
      include: { user: true },
    }) as Promise<Membership[]>;
  }

  async addMember(
    workspaceId: string,
    userId: string,
    role: "OWNER" | "PARTNER",
  ): Promise<Membership> {
    return this.prisma.membership.create({
      data: { workspaceId, userId, role },
    }) as Promise<Membership>;
  }

  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await this.prisma.membership.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    role: "OWNER" | "PARTNER",
  ): Promise<Membership> {
    return this.prisma.membership.update({
      where: { workspaceId_userId: { workspaceId, userId } },
      data: { role },
    }) as Promise<Membership>;
  }

  async getEvents(workspaceId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: { workspaceId },
      orderBy: { date: "asc" },
    }) as Promise<Event[]>;
  }

  async getTasks(workspaceId: string, status?: "TODO" | "IN_PROGRESS" | "DONE"): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { workspaceId, ...(status ? { status } : {}) },
      orderBy: { order: "asc" },
    }) as Promise<Task[]>;
  }

  async getCalendarEvents(
    workspaceId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<CalendarEvent[]> {
    return this.prisma.calendarEvent.findMany({
      where: {
        workspaceId,
        ...(startDate && endDate ? { startAt: { gte: startDate, lte: endDate } } : {}),
      },
      orderBy: { startAt: "asc" },
    }) as Promise<CalendarEvent[]>;
  }

  async getRundowns(workspaceId: string): Promise<Rundown[]> {
    return this.prisma.rundown.findMany({
      where: { workspaceId },
      include: { items: true },
    }) as Promise<Rundown[]>;
  }

  async getChecklists(workspaceId: string): Promise<Checklist[]> {
    return this.prisma.checklist.findMany({
      where: { workspaceId },
      include: { items: true },
    }) as Promise<Checklist[]>;
  }

  async getBudgetCategories(workspaceId: string): Promise<BudgetCategory[]> {
    return this.prisma.budgetCategory.findMany({
      where: { workspaceId },
      include: { expenses: true },
    }) as Promise<BudgetCategory[]>;
  }

  async getExpenses(workspaceId: string): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      where: { workspaceId },
      orderBy: { date: "desc" },
    }) as Promise<Expense[]>;
  }

  async getVendorRequests(workspaceId: string): Promise<VendorRequest[]> {
    return this.prisma.vendorRequest.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    }) as Promise<VendorRequest[]>;
  }

  async getGuests(workspaceId: string): Promise<Guest[]> {
    return this.prisma.guest.findMany({
      where: { workspaceId },
      include: { rsvps: true },
    }) as Promise<Guest[]>;
  }

  async getReviews(workspaceId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    }) as Promise<Review[]>;
  }

  async getNotifications(workspaceId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    }) as Promise<Notification[]>;
  }

  async getAuditLogs(workspaceId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 100,
    }) as Promise<AuditLog[]>;
  }

  async archive(workspaceId: string): Promise<Workspace> {
    return this.update(workspaceId, { status: "ARCHIVED" });
  }
}
