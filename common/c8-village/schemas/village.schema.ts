import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Village {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Province',
    required: true,
  })
  idProvince: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'District',
    required: true,
  })
  idDistrict: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Number, default: 0 })
  position: number;
}

export type VillageDocument = Village & Document;
export const VillageSchema = SchemaFactory.createForClass(Village);
