import { Prop, Schema } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Helper } from 'src/utils/helper.util';
import { Schema as moongooseSchema } from 'mongoose';

@Schema()
export class BaseSchema {
  _id?: moongooseSchema.Types.ObjectId;

  @Prop({ default: Helper.uuid() })
  id?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ default: false })
  isDelete?: boolean;
}
