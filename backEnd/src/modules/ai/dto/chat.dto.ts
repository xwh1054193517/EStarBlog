import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @IsString()
  role: 'system' | 'user' | 'assistant';

  @IsString()
  content: string;
}

export class ChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(32000)
  maxTokens?: number;
}

export class ChatResponseDto {
  content: string;
  tokensUsed?: number;
}

export class CompleteDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  cursorPosition?: number;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  style?: string;
}

export class CompleteSuggestionDto {
  text: string;
  confidence: number;
}

export class CompleteResponseDto {
  suggestions: CompleteSuggestionDto[];
  tokensUsed?: number;
}
