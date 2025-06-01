import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DataModel } from 'src/data/dto/data.dto';
import { Product } from 'src/product/entities/product.entity';
import { DataStatus } from 'src/data/dto/data.dto';
import { Types } from 'mongoose';

export class PDV extends DataModel {
  constructor(model: Partial<PDV>) {
    super();
    Object.assign(this, model);
  }

  @ApiProperty()
  @IsNotEmpty()
  status: DataStatus;

  @ApiProperty()
  @IsNotEmpty()
  products: {
    productId: Types.ObjectId | Product;
    quantity: number;
    discount?: number;
  }[];
}
