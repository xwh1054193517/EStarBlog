import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PostEntity } from './post.entity';

export class PostListEntity {
  @ApiProperty({ type: [PostEntity] })
  items: PostEntity[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
