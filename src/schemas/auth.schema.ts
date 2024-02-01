import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument, Query } from 'mongoose';
import { BaseSchema } from './base.schema';

export type AuthDocument = HydratedDocument<Auth>;

export enum UserType {
  CLIENT = 'client',
  FREELANCER = 'freelancer',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class Auth extends BaseSchema {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ unique: true })
  mobile: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop()
  userType: UserType;

  @Prop({ default: false })
  mobileVerified?: boolean;

  @Prop({ default: false })
  emailVerified?: boolean;
}

export type AuthOptional = Partial<Auth>;

export type AuthQuery = Query<Auth, any, any, any>;

export const AuthSchema = SchemaFactory.createForClass(Auth);
