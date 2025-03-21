import { StorageServiceNameEnum } from '@enum/storage-service.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class FileManager {
  @Prop({
    type: String,
    default: StorageServiceNameEnum.LOCAL_DISK,
  })
  storage: StorageServiceNameEnum;

  @Prop({ type: Array, default: [] })
  file: string[];

  @Prop({ type: String, default: '' })
  type: string;

  // size in bytes
  @Prop({ type: Number, default: 0 })
  size: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  owner: string;
}

export type FileManagerDocument = FileManager & Document;
export const FileManagerSchema = SchemaFactory.createForClass(FileManager);
