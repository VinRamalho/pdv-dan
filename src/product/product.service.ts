import { Injectable, ConflictException } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';
import { ProductDocument, ProductSchema } from './schemas/product.schema';
import { Crud } from 'src/crud/crud.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { DataStatus } from 'src/data/dto/data.dto';
import { MongoError } from 'mongodb';

@Injectable()
export class ProductService extends Crud<ProductSchema> {
  constructor(
    @InjectModel(ProductSchema.name)
    private readonly productModel: Model<ProductSchema>,
  ) {
    super(productModel);
  }

  async create(
    entity: Partial<ProductSchema>,
  ): Promise<HydratedDocument<ProductSchema>> {
    try {
      return await super.createData(entity);
    } catch (error) {
      console.log(error instanceof MongoError);
      console.log(error.code);
      if (error instanceof MongoError && error.code === 11000) {
        throw new ConflictException(
          `A product with title '${entity.title}' already exists`,
        );
      }
      throw error;
    }
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
