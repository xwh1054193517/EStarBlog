import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  AIClient,
  ChatMessage,
  ChatOptions,
  ChatResponse,
} from '../interfaces/ai-client.interface';

@Injectable()
export class KimiClient implements AIClient {
  private client: OpenAI | null = null;

  constructor(private readonly configService: ConfigService) {}

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {},
  ): Promise<ChatResponse> {
    const response = await this.getClient().chat.completions.create({
      model: this.getModel(options.model),
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens,
    };
  }

  async chatStream(
    messages: ChatMessage[],
    options: ChatOptions = {},
    onChunk?: (chunk: string) => void,
  ): Promise<ChatResponse> {
    const stream = await this.getClient().chat.completions.create(
      {
        model: this.getModel(options.model),
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        stream: true,
      },
      options.signal ? { signal: options.signal } : undefined,
    );

    let fullContent = '';
    let tokensUsed = 0;

    for await (const chunk of stream) {
      if (options.signal?.aborted) {
        break;
      }

      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullContent += content;
        onChunk?.(content);
      }

      if (chunk.usage?.total_tokens) {
        tokensUsed = chunk.usage.total_tokens;
      }
    }

    return {
      content: fullContent,
      tokensUsed: tokensUsed || undefined,
    };
  }

  private getClient(): OpenAI {
    if (this.client) {
      return this.client;
    }

    const apiKey = this.configService.get<string>('KIMI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'KIMI_API_KEY environment variable is not configured',
      );
    }

    this.client = new OpenAI({
      apiKey,
      baseURL:
        this.configService.get<string>('KIMI_BASE_URL') ??
        'https://api.moonshot.cn/v1',
    });

    return this.client;
  }

  private getModel(model?: string) {
    return (
      model ?? this.configService.get<string>('KIMI_MODEL') ?? 'moonshot-v1-32k'
    );
  }
}
