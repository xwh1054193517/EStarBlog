import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from "@nestjs/common";
import { SiteConfigService } from "./site-config.service";
import { UpdateBlogConfigDto, UpdateBasicConfigDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("site-config")
export class SiteConfigController {
  constructor(private readonly siteConfigService: SiteConfigService) {}

  @Get()
  async getSiteConfig() {
    return this.siteConfigService.getSiteConfig();
  }

  @Get("blog")
  async getBlogConfig() {
    return this.siteConfigService.getBlogConfig();
  }

  @Get("basic")
  async getBasicConfig() {
    return this.siteConfigService.getBasicConfig();
  }

  @Patch("blog")
  @UseGuards(JwtAuthGuard)
  async updateBlogConfig(@Body() dto: UpdateBlogConfigDto) {
    return this.siteConfigService.updateBlogConfig(dto);
  }

  @Patch("basic")
  @UseGuards(JwtAuthGuard)
  async updateBasicConfig(@Body() dto: UpdateBasicConfigDto) {
    return this.siteConfigService.updateBasicConfig(dto);
  }
}
