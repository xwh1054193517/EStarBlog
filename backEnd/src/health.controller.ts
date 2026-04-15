import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'vx-blog backend is running',
      },
    },
  })
  @Get()
  getStatus(): { message: string } {
    return {
      message: 'vx-blog backend is running',
    };
  }
}
