import { ApiProperty } from '@nestjs/swagger';

// 页面返回参数
export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}
