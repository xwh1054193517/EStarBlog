import { Inject, Injectable } from '@nestjs/common';
import type {
  AIClient,
  ChatMessage,
  ChatOptions,
  ChatResponse,
} from './interfaces/ai-client.interface';
import { AI_CLIENT } from './interfaces/ai-client.interface';

@Injectable()
export class AiService {
  constructor(
    @Inject(AI_CLIENT)
    private readonly aiClient: AIClient,
  ) {}

  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    return this.aiClient.chat(messages, options);
  }

  chatStream(
    messages: ChatMessage[],
    options?: ChatOptions,
    onChunk?: (chunk: string) => void,
  ): Promise<ChatResponse> {
    return this.aiClient.chatStream(messages, options, onChunk);
  }
}
