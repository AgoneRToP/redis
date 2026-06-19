import { File } from '@/modules/files/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ collection: 'products', timestamps: true, versionKey: false })
export class Product {
  @Prop({ type: SchemaTypes.String, allowNull: false })
  title: string;

  @Prop({ type: SchemaTypes.String, allowNull: true })
  description?: string;

  @Prop({ type: SchemaTypes.Number, allowNull: false, min: 0 })
  price: number;

  @Prop({ type: SchemaTypes.Int32, allowNull: false, min: 0 })
  stock: number;

  @Prop({ type: SchemaTypes.Boolean, allowNull: false, default: true })
  isActive: boolean;

  @Prop({ type: SchemaTypes.ObjectId })
  file: File
}

export const ProductSchema = SchemaFactory.createForClass(Product);
