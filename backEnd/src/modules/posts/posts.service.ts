import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { toPagination } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slugify';
import { Prisma } from '../../generated/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const postInclude = Prisma.validator<Prisma.PostInclude>()({
  category: true,
  tags: {
    include: {
      tag: true,
    },
  },
});

type PostWithRelations = Prisma.PostGetPayload<{
  include: typeof postInclude;
}>;

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async listPublic(query: QueryPostsDto) {
    return this.listPosts({ ...query, published: true }, false);
  }

  async listAdmin(query: QueryPostsDto) {
    return this.listPosts(query, true);
  }

  async getArchives() {
    const posts = await this.prisma.post.findMany({
      where: { published: true, publishedAt: { not: null } },
      select: { publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });

    const archiveMap = new Map<string, number>();
    for (const post of posts) {
      if (post.publishedAt) {
        const date = new Date(post.publishedAt);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const key = `${year}-${month}`;
        archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
      }
    }

    const archives = Array.from(archiveMap.entries())
      .map(([key, count]) => {
        const [year, month] = key.split('-');
        return { year, month, count };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return b.year.localeCompare(a.year);
        return b.month.localeCompare(a.month);
      });

    return archives;
  }

  async findPublicBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, published: true },
      include: postInclude,
    });
    if (!post) {
      throw new NotFoundException(`Post ${slug} not found`);
    }
    const redisViews = Number(
      (await this.redisService.get(`post:view:${post.id}`)) ?? 0,
    );
    return this.toPostEntity({
      ...post,
      views: post.views + redisViews,
    });
  }

  async findAdminById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
    return this.toPostEntity(post);
  }

  async create(dto: CreatePostDto, userId: string) {
    const slug = await this.resolveSlug(dto.slug ?? dto.title);
    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        excerpt: dto.excerpt,
        coverImage: dto.coverImage,
        published: dto.published ?? false,
        featured: dto.featured ?? false,
        publishedAt: dto.published ? new Date() : null,
        readingTime: this.estimateReadingTime(dto.content),
        author: { connect: { id: userId } },
        ...(dto.categoryId
          ? { category: { connect: { id: dto.categoryId } } }
          : {}),
        ...(dto.tagIds?.length
          ? {
              tags: {
                create: dto.tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              },
            }
          : {}),
      },
      include: postInclude,
    });
    return this.toPostEntity(post);
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.ensureExists(id);
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.slug !== undefined
          ? { slug: await this.resolveSlug(dto.slug, id) }
          : {}),
        ...(dto.content !== undefined
          ? {
              content: dto.content,
              readingTime: this.estimateReadingTime(dto.content),
            }
          : {}),
        ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt } : {}),
        ...(dto.coverImage !== undefined ? { coverImage: dto.coverImage } : {}),
        ...(dto.featured !== undefined ? { featured: dto.featured } : {}),
        ...(dto.published !== undefined
          ? {
              published: dto.published,
              publishedAt: dto.published ? new Date() : null,
            }
          : {}),
        ...(dto.categoryId !== undefined
          ? dto.categoryId
            ? { category: { connect: { id: dto.categoryId } } }
            : { category: { disconnect: true } }
          : {}),
        ...(dto.tagIds !== undefined
          ? {
              tags: {
                deleteMany: {},
                create: dto.tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              },
            }
          : {}),
      },
      include: postInclude,
    });
    return this.toPostEntity(post);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deleted successfully' };
  }

  async incrementView(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) {
      throw new NotFoundException(`Post ${slug} not found`);
    }

    await this.redisService.incrby(`post:view:${post.id}`, 1);
    return { message: 'View tracked' };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async flushViews() {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.redisService.scan(
        cursor,
        'post:view:*',
        100,
      );
      cursor = nextCursor;

      for (const key of keys) {
        try {
          const value = await this.redisService.getdel(key);
          const count = Number(value ?? 0);

          if (!Number.isFinite(count) || count <= 0) {
            continue;
          }

          const postId = key.replace('post:view:', '');

          await this.prisma.post.update({
            where: { id: postId },
            data: {
              views: {
                increment: count,
              },
            },
          });
        } catch (error) {
          console.error(`Failed to flush post views for key: ${key}`);
          console.error(error);
        }
      }
    } while (cursor !== '0');
  }

  private async listPosts(query: QueryPostsDto, includeDrafts: boolean) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    let categoryId: string | undefined;
    let tagIds: string[] = [];

    if (query.category) {
      const category = await this.prisma.category.findUnique({
        where: { slug: query.category },
        select: { id: true },
      });
      categoryId = category?.id;
    }

    if (query.tag) {
      const tagSlugs = Array.isArray(query.tag) ? query.tag : [query.tag];
      const tags = await this.prisma.tag.findMany({
        where: { slug: { in: tagSlugs } },
        select: { id: true },
      });
      tagIds = tags.map((t) => t.id);
    }

    const dateFilter = (() => {
      if (!query.year && !query.month) return null;
      const year = query.year || String(new Date().getFullYear());
      const month = query.month ? String(query.month).padStart(2, '0') : '01';
      const day = query.month ? '31' : '01';
      return {
        gte: new Date(`${year}-${month}-01T00:00:00.000Z`),
        lt: new Date(`${year}-${month}-${day}T23:59:59.999Z`),
      };
    })();

    const where: Prisma.PostWhereInput = {
      ...(includeDrafts
        ? query.published !== undefined
          ? { published: query.published }
          : {}
        : { published: true }),
      ...(query.keyword
        ? {
            OR: [
              { title: { contains: query.keyword, mode: 'insensitive' } },
              { excerpt: { contains: query.keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(tagIds.length > 0
        ? { tags: { some: { tagId: { in: tagIds } } } }
        : {}),
      ...(query.featured !== undefined ? { featured: query.featured } : {}),
      ...(dateFilter ? { publishedAt: dateFilter } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ updatedAt: 'desc' }],
        include: postInclude,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toPostEntity(item)),
      pagination: toPagination(page, pageSize, total),
    };
  }

  private toPostEntity(post: PostWithRelations) {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      published: post.published,
      featured: post.featured,
      views: post.views,
      readingTime: post.readingTime,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      categoryId: post.categoryId,
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
      tags: post.tags.map((item) => ({
        id: item.tag.id,
        name: item.tag.name,
        slug: item.tag.slug,
      })),
    };
  }

  private async ensureExists(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post ${id} not found`);
    }
  }

  private estimateReadingTime(content: string) {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 300));
  }

  private async resolveSlug(raw: string, currentId?: string) {
    const base = slugify(raw) || `post-${Date.now()}`;
    let candidate = base;
    let index = 1;

    while (true) {
      const existing = await this.prisma.post.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!existing || existing.id === currentId) {
        return candidate;
      }
      index += 1;
      candidate = `${base}-${index}`;
    }
  }
}
