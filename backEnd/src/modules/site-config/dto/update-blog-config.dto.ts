import { IsOptional, IsString, IsObject } from "class-validator";

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

  @IsOptional()
  @IsObject({ each: true })
  sidebarSocial?: Array<{ name: string; url: string; icon: string }>;

  @IsOptional()
  @IsObject({ each: true })
  footerSocial?: Array<{ name: string; url: string; icon: string; position?: string }>;

  @IsOptional()
  @IsObject({ each: true })
  footerLinks?: Array<{ name: string; url: string }>;
}
