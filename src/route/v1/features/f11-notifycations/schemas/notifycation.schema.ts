import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  } from 'aws-sdk/clients/acm';
import { ObjectId } from 'mongodb';


@Schema({ timestamps: true, versionKey: false, collection: 'products' })
export class Notifycation {
  @Prop({ type: ObjectId, ref: 'User', required: true })
  senderId: ObjectId;

  @Prop({ type: ObjectId, ref: 'User', required: true })
  recipientId: ObjectId;

  @Prop({ type: String, default: '' })
  notificationType: string;

  @Prop({ type: String, default: '' })
  entityName: string;

  @Prop({ type: ObjectId, required: true })
  entityId: ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  thumbnail?: string;

  @Prop({ type: Boolean, default: false })
  isOpened: boolean;

  @Prop({ type: Object, default: {} })
  options: Record<string, any>;
}

export type NotifycationDocument = Notifycation & Document;
export const NotifycationSchema = SchemaFactory.createForClass(Notifycation);