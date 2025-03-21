import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'customers' })
export class Customer extends Document {
  @Prop({ type: String, default: '' })
  name: string;
  @Prop({ type: String, default: '' })
  password: string;
  @Prop({ type: String, default: '' })
  email: string;
}

export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
