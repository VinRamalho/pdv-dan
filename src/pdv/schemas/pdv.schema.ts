import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Document,
  Schema as SchemaType,
  Types,
} from 'mongoose';
import { PDV } from '../entities/pdv.entity';
import { DataStatus } from 'src/data/dto/data.dto';
import { Product } from 'src/product/entities/product.entity';

export type PDVDocument = HydratedDocument<PDVSchema>;

@Schema({ collection: 'pdvs', timestamps: true })
export class PDVSchema
  extends Document
  implements Omit<PDV, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ type: Number, enum: DataStatus })
  status: DataStatus;

  @Prop()
  sequence: string;

  @Prop()
  supplier: string;

  @Prop()
  purchaser: string;

  @Prop()
  shipTo: string;

  @Prop([
    {
      productId: {
        type: SchemaType.Types.ObjectId,
        ref: 'ProductSchema',
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },

      discount: { type: Number, required: true, min: 1 },
    },
  ])
  products: {
    productId: Types.ObjectId | Product;
    quantity: number;
    discount?: number;
  }[];
}

export const PDVSchemaFactory = SchemaFactory.createForClass(PDVSchema);
