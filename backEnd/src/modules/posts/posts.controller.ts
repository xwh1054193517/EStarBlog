import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { getCurrentUserDec } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../generated/prisma';
import type { AccessTokenPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostListEntity } from './entities/post-list.entity';
import { PostsService } from './posts.service';

@ApiTags('Public Posts', 'Admin Posts')
@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts')
  @ApiOperation({ summary: 'List public posts' })
  @ApiOkResponse({ type: PostListEntity })
  listPublic(@Query() query: QueryPostsDto) {
    return this.postsService.listPublic(query);
  }

  @Get('posts/:slug')
  @ApiOperation({ summary: 'Get public post detail' })
  @ApiOkResponse({ type: PostEntity })
  findPublicBySlug(@Param('slug') slug: string) {
    return this.postsService.findPublicBySlug(slug);
  }

  @Post('posts/:slug/views')
  @ApiOperation({ summary: 'Track post view' })
  incrementView(@Param('slug') slug: string) {
    return this.postsService.incrementView(slug);
  }

  @Get('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List admin posts' })
  @ApiOkResponse({ type: PostListEntity })
  listAdmin(@Query() query: QueryPostsDto) {
    return this.postsService.listAdmin(query);
  }

  @Get('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  findAdminById(@Param('id') id: string) {
    return this.postsService.findAdminById(id);
  }

  @Post('admin/posts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  create(
    @Body() dto: CreatePostDto,
    @getCurrentUserDec() user: AccessTokenPayload,
  ) {
    return this.postsService.create(dto, user.sub);
  }

  @Patch('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Delete('admin/posts/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
