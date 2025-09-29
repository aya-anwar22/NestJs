import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
userId: mongoose.Types.ObjectId;

@Prop({ default: false })
isVerified: boolean;

@Prop({ type: String, default: null })
refreshToken?: string | null;

@Prop({ type: Date, default: null })
refreshTokenExpiry?: Date | null;

@Prop({ type: String, default: null })
emailVerificationCode?: string | null;

@Prop({ type: Date, default: null })
verificationCodeExpiry?: Date | null;

@Prop({ type: String, default: null })
resetPasswordCode?: string | null;

@Prop({ type: Date, default: null })
resetPasswordExpiry?: Date | null;

}

export const AuthSchema = SchemaFactory.createForClass(Auth);
