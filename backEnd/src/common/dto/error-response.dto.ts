import { ApiProperty } from '@nestjs/swagger';

// 错误请求相应
export class ErrorResponseDto {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiProperty()
  requestId: string;
}
