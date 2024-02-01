import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../base.schema';

@Schema()
//TODO: Remove export as it can only be used in this file
export class Location {
  @Prop()
  lat: number;

  @Prop()
  lng: number;
}
// TODO: Remove export
export const LocationSchema = SchemaFactory.createForClass(Location);

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address extends BaseSchema {
  @Prop({ index: true })
  address1: string;

  @Prop({ index: true })
  address2: string;

  @Prop({ index: true })
  city: string;

  @Prop({ index: true })
  state: string;

  @Prop({ index: true })
  landmark: string;

  @Prop()
  pincode: number;

  @Prop({ type: LocationSchema, _id: false })
  coordinates: Location;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
