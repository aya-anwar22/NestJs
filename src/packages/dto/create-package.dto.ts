import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({ description: 'ID of the related service' })
  @IsString()
  serviceId: string;

  @ApiProperty({ description: 'Package name' })
  @IsString()
  packageName: string;

  @ApiProperty({ description: 'Unique slug for the package' })
  @IsString()
  @IsOptional()
  packageSlug?: string;

  @ApiProperty({ description: 'Price range of the package' })
  @IsString()
  priceRange: string;

  @ApiProperty({ description: 'Discounted price range', required: false })
  @IsOptional()
  @IsString()
  discountedRange?: string;

  @ApiProperty({ description: 'Payment plan', required: false })
  @IsOptional()
  @IsString()
  paymentPlan?: string;

  @ApiProperty({ description: 'Duration of the package in days', required: false })
  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ description: 'Features included in the package', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({ description: 'Tools included in the package', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @ApiProperty({ description: 'Is the package deleted?', default: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({ description: 'Deletion date', required: false })
  @IsOptional()
  deletedAt?: Date;
}
