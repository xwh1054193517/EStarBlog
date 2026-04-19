import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateBlogConfigDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString({ each: true })
  typingTexts?: string[];

  @IsOptional()
  @IsString()
  announcement?: string;

  @IsOptional()
  @IsString()
  established?: string;
}
