/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { getDatabase } from "@/server/db/client";

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type SortOrder = "asc" | "desc";

export type BaseFilter = Record<string, unknown>;

export abstract class BaseRepository<T, TCreate, TUpdate, TFilter extends BaseFilter = BaseFilter> {
  protected abstract modelName: string;
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = getDatabase();
  }

  protected abstract mapCreateInput(input: TCreate): Record<string, unknown>;
  protected abstract mapUpdateInput(input: TUpdate): Record<string, unknown>;
  protected abstract mapFilter(filter: TFilter): Record<string, unknown>;
  protected abstract includeRelations(): Record<string, unknown>;

  protected getModel(): {
    findUnique: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any[]>;
    count: (args: any) => Promise<number>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  } {
    return (this.prisma as Record<string, any>)[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    const model = this.getModel();
    return model.findUnique({
      where: { id },
      include: this.includeRelations(),
    });
  }

  async findMany(
    filter: TFilter = {} as TFilter,
    pagination?: PaginationParams,
    sortBy?: string,
    sortOrder: SortOrder = "asc",
  ): Promise<PaginatedResult<T>> {
    const page = pagination?.page ?? 1;
    const limit = Math.min(pagination?.limit ?? 50, 100);
    const skip = (page - 1) * limit;
    const where = this.mapFilter(filter);

    const model = this.getModel();
    const [data, total] = await Promise.all([
      model.findMany({
        where,
        include: this.includeRelations(),
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
      }),
      model.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as T[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async create(data: TCreate): Promise<T> {
    const model = this.getModel();
    return model.create({
      data: this.mapCreateInput(data),
      include: this.includeRelations(),
    });
  }

  async update(id: string, data: TUpdate): Promise<T> {
    const model = this.getModel();
    return model.update({
      where: { id },
      data: this.mapUpdateInput(data),
      include: this.includeRelations(),
    });
  }

  async delete(id: string): Promise<T> {
    const model = this.getModel();
    return model.delete({
      where: { id },
      include: this.includeRelations(),
    });
  }

  async softDelete(id: string): Promise<T> {
    const model = this.getModel();
    return model.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: this.includeRelations(),
    });
  }

  async count(filter: TFilter = {} as TFilter): Promise<number> {
    const model = this.getModel();
    return model.count({
      where: this.mapFilter(filter),
    });
  }

  async exists(id: string): Promise<boolean> {
    const model = this.getModel();
    const count = await model.count({
      where: { id },
    });
    return count > 0;
  }

  async transaction<R>(fn: (tx: PrismaClient) => Promise<R>): Promise<R> {
    return this.prisma.$transaction(fn as (tx: PrismaClient) => Promise<R>);
  }

  async batchCreate(items: TCreate[]): Promise<T[]> {
    const model = this.getModel();
    return this.prisma.$transaction(
      items.map((item) =>
        model.create({
          data: this.mapCreateInput(item),
          include: this.includeRelations(),
        }),
      ),
    ) as Promise<T[]>;
  }
}
