import { PartialType } from '@nestjs/mapped-types';
import { CreateDevelopmentStageDto } from './create-development-stage.dto';

export class UpdateDevelopmentStageDto extends PartialType(CreateDevelopmentStageDto) {}
