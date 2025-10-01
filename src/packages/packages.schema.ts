import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServicePackageDocument = ServicePackage & Document;

@Schema({ timestamps: true })
export class ServicePackage {
  @Prop({ required: true, unique: true })
  serviceId: string;

  @Prop({ required: true })
  packageName: string;

  @Prop({ required: true, unique: true })
  packageSlug: string;


  @Prop({ required: true })
  priceRange: string;

  @Prop()
  discountedRange: string;

  @Prop()
  paymentPlan: string;

  @Prop()
  durationDays: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: [String], default: [] })
  tools: string[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const ServicePackageSchema = SchemaFactory.createForClass(ServicePackage);
