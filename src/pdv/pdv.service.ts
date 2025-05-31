import { Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';
import { PDVDocument, PDVSchema } from './schemas/pdv.schema';
import { ProductService } from 'src/product/product.service';
import { Crud } from 'src/crud/crud.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { AddProductDto, CreatePDVDto } from './dto/pdv.dto';

@Injectable()
export class PDVService extends Crud<PDVSchema> {
  constructor(
    @InjectModel(PDVSchema.name)
    private readonly pdvModel: Model<PDVSchema>,
    private readonly productService: ProductService,
  ) {
    super(pdvModel);
  }

  async generateSequence(): Promise<string> {
    const res = await this.pdvModel
      .find()
      .sort({ sequence: -1 })
      .limit(1)
      .exec();
    const lastSequence = res[0]?.sequence ?? '000000';
    const nextNumber = parseInt(lastSequence) + 1;
    return nextNumber.toString().padStart(6, '0');
  }

  async findAll(): Promise<HydratedDocument<PDVDocument>[]> {
    const res = await this.pdvModel
      .find()
      .populate('products.productId')
      .exec();

    return res ?? [];
  }
}
