import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { DataStatus } from 'src/data/dto/data.dto';
import { Product } from '../entities/product.entity';

export type ProductDocument = HydratedDocument<ProductSchema>;

@Schema({ collection: 'products', timestamps: true })
export class ProductSchema
  extends Document
  implements Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ type: Number, enum: DataStatus })
  status: DataStatus;

  @Prop({ index: true })
  title: string; // part number

  @Prop()
  description: string;

  @Prop()
  price: number;
}

export const ProductSchemaFactory = SchemaFactory.createForClass(ProductSchema);
