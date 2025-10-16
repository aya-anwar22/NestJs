import { IsNotEmpty, IsOptional, IsString, IsNumber, IsMongoId, IsDate } from 'class-validator';

export class CreateDevelopmentStageDto {
  @IsMongoId()
  @IsNotEmpty()
  serviceId: string;

  @IsNumber()
  @IsNotEmpty()
  stageNumber: number;

  @IsString()
  @IsNotEmpty()
  stageName: string;

  @IsOptional()
  stageSlug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  deletedAt?: Date | null;
}
