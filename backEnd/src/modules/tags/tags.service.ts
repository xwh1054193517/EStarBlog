import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../common/utils/slugify';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  SearchQueryDto,
  PaginatedResult,
} from '../../common/dto/pagination.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic() {
    const tags = await this.prisma.tag.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: {
              where: {
                post: {
                  published: true,
                },
              },
            },
          },
        },
      },
    });

    return tags.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      color: item.color,
      postCount: item._count.posts,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findAllAdmin(
    query: SearchQueryDto,
  ): Promise<PaginatedResult<{ id: string; name: string; slug: string; color: string | null; postCount: number; createdAt: string; updatedAt: string }>> {
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

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ createdAt: 'desc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      }),
      this.prisma.tag.count({ where }),
    ]);

    return {
      data: tags.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        color: item.color,
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

  async create(dto: CreateTagDto) {
    const tag = await this.prisma.tag.create({
      data: {
        name: dto.name,
        slug: dto.slug ? slugify(dto.slug) : slugify(dto.name),
        color: dto.color,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...tag,
      postCount: 0,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    };
  }

  async update(id: string, dto: UpdateTagDto) {
    const tag = await this.prisma.tag.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.slug !== undefined ? { slug: slugify(dto.slug) } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
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
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      postCount: tag._count.posts,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    };
  }

  async remove(id: string) {
    try {
      await this.prisma.$transaction([
        this.prisma.postTag.deleteMany({ where: { tagId: id } }),
        this.prisma.tag.delete({ where: { id } }),
      ]);
      return { message: 'Tag deleted successfully' };
    } catch {
      throw new NotFoundException(`Tag ${id} not found`);
    }
  }

  async batchDelete(ids: string[]) {
    if (!ids || ids.length === 0) {
      return { message: 'No tags to delete' };
    }

    await this.prisma.$transaction([
      this.prisma.postTag.deleteMany({ where: { tagId: { in: ids } } }),
      this.prisma.tag.deleteMany({ where: { id: { in: ids } } }),
    ]);

    return { message: `${ids.length} tags deleted successfully` };
  }
}
