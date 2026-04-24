import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import {
  ChatDto,
  ChatResponseDto,
  CompleteDto,
  CompleteResponseDto,
} from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI 对话接口（Kimi）' })
  async chat(@Body() chatDto: ChatDto): Promise<ChatResponseDto> {
    const result = await this.aiService.chat(chatDto.messages, {
      model: chatDto.model,
      temperature: chatDto.temperature,
      maxTokens: chatDto.maxTokens,
    });
    return {
      content: result.content,
      tokensUsed: result.tokensUsed,
    };
  }

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI 内容补全接口' })
  async complete(
    @Body() completeDto: CompleteDto,
  ): Promise<CompleteResponseDto> {
    const { content, cursorPosition, style } = completeDto;

    const beforeCursor = content.slice(0, cursorPosition || content.length);
    const recentContext = beforeCursor.slice(-500);

    const prompt = this.buildCompletionPrompt(recentContext, style || '专业');

    const result = await this.aiService.chat(
      [
        {
          role: 'system',
          content:
            '你是一个专业的写作助手，擅长根据上下文提供流畅的内容补全建议。',
        },
        { role: 'user', content: prompt },
      ],
      {
        maxTokens: 100,
        temperature: 0.7,
      },
    );

    const suggestion = result.content.trim();

    if (!suggestion || suggestion.length > 200) {
      return {
        suggestions: [],
        tokensUsed: result.tokensUsed,
      };
    }

    return {
      suggestions: [
        {
          text: suggestion,
          confidence: 0.8,
        },
      ],
      tokensUsed: result.tokensUsed,
    };
  }

  private buildCompletionPrompt(context: string, style: string): string {
    return `请根据以下上下文，生成一句自然流畅的内容补全建议。

上下文：${context}

风格要求：${style}

要求：
1. 补全内容要符合上下文语义
2. 保持与前文风格一致
3. 不要重复已有的内容
4. 直接返回补全文本，不要添加解释

请直接返回补全内容：`;
  }
}
