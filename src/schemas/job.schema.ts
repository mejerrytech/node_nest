import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Auth } from './auth.schema';
import { BaseSchema } from './base.schema';
import { Address } from './common/address.schema';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true, autoIndex: true })
export class Job extends BaseSchema {
  @Prop({ index: true })
  title: string;

  @Prop({ index: true })
  description: string;

  @Prop()
  date: Date;

  @Prop()
  time: Date;

  @Prop()
  duration: number;

  @Prop()
  attachment: string[];

  @Prop({ index: true })
  tags: string[];

  @Prop({ ref: Address.name, type: mongoose.Types.ObjectId })
  address: mongoose.Types.ObjectId;

  @Prop({ ref: Auth.name })
  userId: string;
}
export type JobOptional = Partial<Job>;

export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.index({
  '$**': 'text',
});

export type JobSearch = Omit<Job, 'address'> & {
  address: Address;
};
