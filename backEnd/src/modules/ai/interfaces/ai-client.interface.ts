export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface ChatResponse {
  content: string;
  tokensUsed?: number;
}

export interface AIClient {
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
  chatStream(
    messages: ChatMessage[],
    options?: ChatOptions,
    onChunk?: (chunk: string) => void,
  ): Promise<ChatResponse>;
}

export const AI_CLIENT = 'AI_CLIENT';
