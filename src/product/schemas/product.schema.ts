import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Schema as SchemaType } from 'mongoose';
import { UserDto } from 'src/users/dto/user.dto';
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

  @Prop({ unique: true, index: true })
  title: string; // part number

  @Prop()
  description: string;

  @Prop()
  price: number;
}

export const ProductSchemaFactory = SchemaFactory.createForClass(ProductSchema);
