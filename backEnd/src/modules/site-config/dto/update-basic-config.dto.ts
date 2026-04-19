import { IsOptional, IsString } from "class-validator";

export class UpdateBasicConfigDto {
  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  authorDesc?: string;

  @IsOptional()
  @IsString()
  authorAvatar?: string;

  @IsOptional()
  @IsString()
  homeUrl?: string;
}
