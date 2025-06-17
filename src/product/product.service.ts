import { Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';
import { ProductDocument, ProductSchema } from './schemas/product.schema';
import { Crud } from 'src/crud/crud.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { DataStatus } from 'src/data/dto/data.dto';

@Injectable()
export class ProductService extends Crud<ProductSchema> {
  constructor(
    @InjectModel(ProductSchema.name)
    private readonly productModel: Model<ProductSchema>,
  ) {
    super(productModel);
  }

  async findByUserId(
    userId: string,
  ): Promise<HydratedDocument<ProductDocument>[] | undefined> {
    return this.productModel.find({ user: userId }).exec();
  }

  async findAll(): Promise<HydratedDocument<ProductDocument>[] | undefined> {
    return this.productModel.find({ status: DataStatus.DRAFT }).exec();
  }

  async markAllAsObsolete(): Promise<{ modifiedCount: number }> {
    const result = await this.productModel
      .updateMany(
        { status: DataStatus.DRAFT },
        { $set: { status: DataStatus.OBSOLETE } },
      )
      .exec();

    return { modifiedCount: result.modifiedCount };
  }
}
