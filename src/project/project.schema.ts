import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  projectName: string;

  @Prop({ required: true, unique: true })
  projectSlug: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop()
  projectUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop()
  clientName: string;

  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  deletedBy: Types.ObjectId | null;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
