import { IsNotEmpty, IsOptional, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class FeatureDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
}

class ImportanceDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
}

export class CreateServiceDto {
  @IsNotEmpty()
  serviceName: string;

  @IsOptional()
  serviceSlug?: string
  
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features?: FeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportanceDto)
  importance?: ImportanceDto[];

  @IsOptional()
  @IsArray()
  categories?: string[];  
}
