import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../common/utils/slugify';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPublic() {
    const tags = await this.prisma.tag.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
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
      ...item,
      postCount: item._count.posts,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async findAllAdmin() {
    const tags = await this.prisma.tag.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return tags.map((item) => ({
      ...item,
      postCount: item._count.posts,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  async create(dto: CreateTagDto) {
    const tag = await this.prisma.tag.create({
      data: {
        name: dto.name,
        slug: dto.slug ? slugify(dto.slug) : slugify(dto.name),
        color: dto.color,
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
    await this.ensureExists(id);
    const tag = await this.prisma.tag.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.slug !== undefined ? { slug: slugify(dto.slug) } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return {
      ...tag,
      postCount: tag._count.posts,
      createdAt: tag.createdAt.toISOString(),
      updatedAt: tag.updatedAt.toISOString(),
    };
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.$transaction([
      this.prisma.postTag.deleteMany({ where: { tagId: id } }),
      this.prisma.tag.delete({ where: { id } }),
    ]);
    return { message: 'Tag deleted successfully' };
  }

  private async ensureExists(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag ${id} not found`);
    }
  }
}
