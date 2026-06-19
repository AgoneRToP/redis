import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ collection: 'files', timestamps: true, versionKey: false })
export class File {
  @Prop({ type: SchemaTypes.String, allowNull: false })
  fileName: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
