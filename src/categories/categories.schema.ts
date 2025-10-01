import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  categoryName: string;

  @Prop({ required: true, unique: true })
  categorySlug: string;

  @Prop()
  description: string;


  
  @Prop({ default: false })
  isDeleted: boolean;

 @Prop({ type: Date, default: null })
  deletedAt: Date | null; 
}

export const CategorySchema = SchemaFactory.createForClass(Category);
