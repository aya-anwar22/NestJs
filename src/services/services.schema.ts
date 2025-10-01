import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document; 

@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true })
  serviceName: string;

  @Prop({ required: true, unique: true })
  serviceSlug: string;

  @Prop()
  description: string;

  @Prop([
    {
      image: { type: String },
      title: { type: String },
      description: { type: String },
    },
  ])
  features: { image: string; title: string; description: string }[];

  @Prop([
    {
      image: { type: String },
      title: { type: String },
      description: { type: String },
    },
  ])
  importance: { image: string; title: string; description: string }[];

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
