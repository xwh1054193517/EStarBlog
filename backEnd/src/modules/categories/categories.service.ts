import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../common/utils/slugify';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  SearchQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    });

    return categories.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      color: item.color,
      icon: item.icon,
      sortOrder: item.sortOrder,
      postCount: item._count.posts,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findAllAdmin(query: SearchQueryDto): Promise<
    PaginatedResult<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      color: string | null;
      icon: string | null;
      sortOrder: number;
      postCount: number;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { slug: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
          icon: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        color: item.color,
        icon: item.icon,
        sortOrder: item.sortOrder,
        postCount: item._count.posts,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug ? slugify(dto.slug) : slugify(dto.name),
        description: dto.description,
        color: dto.color,
        icon: dto.icon,
        sortOrder: dto.sortOrder ?? 0,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...category,
      postCount: 0,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.slug !== undefined ? { slug: slugify(dto.slug) } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.icon !== undefined ? { icon: dto.icon } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      icon: category.icon,
      sortOrder: category.sortOrder,
      postCount: category._count.posts,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  async remove(id: string) {
    try {
      await this.prisma.category.delete({ where: { id } });
      return { message: 'Category deleted successfully' };
    } catch {
      throw new NotFoundException(`Category ${id} not found`);
    }
  }

  async batchDelete(ids: string[]) {
    if (!ids || ids.length === 0) {
      return { message: 'No categories to delete' };
    }

    await this.prisma.category.deleteMany({ where: { id: { in: ids } } });

    return { message: `${ids.length} categories deleted successfully` };
  }
}
