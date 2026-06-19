import { File } from '@/modules/files/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class User {
  @Prop({ type: SchemaTypes.String, allowNull: false })
  name: string;

  @Prop({ type: SchemaTypes.Int32, allowNull: true, min: 12 })
  age?: number;

  @Prop({ type: SchemaTypes.String, allowNull: false })
  email: string;

  @Prop({ type: SchemaTypes.String, allowNull: false })
  password: string;

  @Prop({ type: SchemaTypes.ObjectId })
  file: File
}

export const UserSchema = SchemaFactory.createForClass(User);
