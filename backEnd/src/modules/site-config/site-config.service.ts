import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateBlogConfigDto, UpdateBasicConfigDto } from "./dto";

@Injectable()
export class SiteConfigService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly CONFIG_KEYS = {
    BLOG: "blog",
    BASIC: "basic",
  } as const;

  async getSiteConfig(): Promise<{ blog: Record<string, any>; basic: Record<string, any> }> {
    const [blogConfig, basicConfig] = await Promise.all([
      this.getBlogConfig(),
      this.getBasicConfig(),
    ]);

    return {
      blog: blogConfig,
      basic: basicConfig,
    };
  }

  async getBlogConfig(): Promise<Record<string, any>> {
    const config = await this.prisma.siteConfig.findUnique({
      where: { key: this.CONFIG_KEYS.BLOG },
    });

    if (!config) {
      return this.getDefaultBlogConfig();
    }

    try {
      return JSON.parse(config.value);
    } catch {
      return this.getDefaultBlogConfig();
    }
  }

  async getBasicConfig(): Promise<Record<string, any>> {
    const config = await this.prisma.siteConfig.findUnique({
      where: { key: this.CONFIG_KEYS.BASIC },
    });

    if (!config) {
      return this.getDefaultBasicConfig();
    }

    try {
      return JSON.parse(config.value);
    } catch {
      return this.getDefaultBasicConfig();
    }
  }

  async updateBlogConfig(dto: UpdateBlogConfigDto): Promise<Record<string, any>> {
    const existing = await this.getBlogConfig();
    const updated = { ...existing, ...dto };

    await this.prisma.siteConfig.upsert({
      where: { key: this.CONFIG_KEYS.BLOG },
      update: { value: JSON.stringify(updated) },
      create: {
        key: this.CONFIG_KEYS.BLOG,
        value: JSON.stringify(updated),
      },
    });

    return updated;
  }

  async updateBasicConfig(dto: UpdateBasicConfigDto): Promise<Record<string, any>> {
    const existing = await this.getBasicConfig();
    const updated = { ...existing, ...dto };

    await this.prisma.siteConfig.upsert({
      where: { key: this.CONFIG_KEYS.BASIC },
      update: { value: JSON.stringify(updated) },
      create: {
        key: this.CONFIG_KEYS.BASIC,
        value: JSON.stringify(updated),
      },
    });

    return updated;
  }

  private getDefaultBlogConfig(): Record<string, any> {
    return {
      title: "EstarBlog",
      subtitle: "EternalStar",
      typingTexts: ["记录生活思考", "收藏世界真知", "design to react"],
      announcement: "",
      established: "2024-01-01",
      sidebarSocial: [],
      footerSocial: [],
      footerLinks: [],
    };
  }

  private getDefaultBasicConfig(): Record<string, any> {
    return {
      author: "EternalStar",
      authorDesc: "",
      authorAvatar: "",
      homeUrl: "",
    };
  }
}
