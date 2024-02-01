import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';
import { Auth, UserType } from './auth.schema';
import { AddressDto } from 'src/dtos/common/address.dto';
import { Address } from './common/address.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile extends BaseSchema {
  @Prop({ required: true })
  imageURL: string;

  @Prop()
  tags: string[];

  @Prop()
  dateOfBirth: Date;

  @Prop({ ref: Address.name, type: mongooseSchema.Types.ObjectId })
  homeAddress: AddressDto;

  @Prop({ ref: Address.name, type: mongooseSchema.Types.ObjectId })
  workAddress?: AddressDto;

  @Prop()
  userType: UserType;

  @Prop({ ref: Auth.name })
  userId: string;

  @Prop()
  isWorkAddressSameAsHome: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
