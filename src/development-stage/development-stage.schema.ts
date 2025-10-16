import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DevelopmentStageDocument = DevelopmentStage & Document;

@Schema({ timestamps: true })
export class DevelopmentStage {
  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  serviceId: Types.ObjectId;

  @Prop({ required: true })
  stageNumber: number;

  @Prop({ required: true })
  stageName: string;

  @Prop({ required: true, unique: true })
  stageSlug: string;


  @Prop()
  description: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

}

export const DevelopmentStageSchema = SchemaFactory.createForClass(DevelopmentStage);
