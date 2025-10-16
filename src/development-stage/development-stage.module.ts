import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevelopmentStage, DevelopmentStageSchema } from './development-stage.schema';
import { DevelopmentStageService } from './development-stage.service';
import { DevelopmentStageController } from './development-stage.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DevelopmentStage.name, schema: DevelopmentStageSchema }])
  ],
  controllers: [DevelopmentStageController],
  providers: [DevelopmentStageService]
})
export class DevelopmentStageModule {}
