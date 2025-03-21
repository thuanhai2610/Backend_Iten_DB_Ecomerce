import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Province {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Number, default: 0 })
  position: number;
}

export type ProvinceDocument = Province & Document;
export const ProvinceSchema = SchemaFactory.createForClass(Province);
