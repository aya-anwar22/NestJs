import { IsNotEmpty, IsOptional, IsString, IsArray, IsMongoId, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsNotEmpty()
  @IsString()
  projectSlug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  projectUrl?: string;

  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];
}
