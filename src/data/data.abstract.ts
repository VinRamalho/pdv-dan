import { Injectable } from '@nestjs/common';
import { Model, Document, HydratedDocument, FilterQuery } from 'mongoose';

@Injectable()
export abstract class Data<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  protected async createData(entity: Partial<T>): Promise<HydratedDocument<T>> {
    const create = new this.model(entity);
    return await create.save();
  }

  protected async findDataAll(
    populate?: string,
    fieldsPopulate?: string[],
  ): Promise<HydratedDocument<T>[]> {
    const query = this.model.find();

    if (populate) {
      query.populate({
        path: populate,
        select: fieldsPopulate,
      });
    }

    return await query.exec();
  }

  protected async findDataById(
    id: string,
    populate?: string,
    fieldsPopulate?: string[],
  ): Promise<HydratedDocument<T> | undefined> {
    try {
      const query = this.model.findById(id);

      if (populate) {
        query.populate({
          path: populate,
          select: fieldsPopulate,
        });
      }

      const res = await query.exec();

      return res;
    } catch (err) {
      if (
        err.name === 'CastError' &&
        err.kind === 'ObjectId' &&
        err.path === '_id'
      ) {
        return undefined;
      } else {
        throw err;
      }
    }
  }

  protected async findDataByField(
    field: Partial<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    const key = Object.keys(field).at(0);

    const query = { [key]: field[key] } as any;

    try {
      const res = await this.model.findOne<T>(query).exec();

      return res as HydratedDocument<T>;
    } catch (err) {
      if (
        err.name === 'CastError' &&
        err.kind === 'ObjectId' &&
        err.path === '_id'
      ) {
        return undefined;
      } else {
        throw err;
      }
    }
  }

  protected async updateData(
    id: string,
    updateEntity: Partial<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    try {
      const res = await this.model
        .findByIdAndUpdate(id, updateEntity, { new: true })
        .exec();

      return res;
    } catch (err) {
      if (
        err.name === 'CastError' &&
        err.kind === 'ObjectId' &&
        err.path === '_id'
      ) {
        return undefined;
      } else {
        throw err;
      }
    }
  }

  protected async setData(
    id: string,
    updateEntity: Partial<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    try {
      const res = await this.model
        .findByIdAndUpdate(id, updateEntity, { new: true })
        .exec();

      return res;
    } catch (err) {
      if (
        err.name === 'CastError' &&
        err.kind === 'ObjectId' &&
        err.path === '_id'
      ) {
        return undefined;
      } else {
        throw err;
      }
    }
  }

  protected async deleteData(id: string) {
    try {
      const res = await this.model.findByIdAndDelete(id).exec();

      return res;
    } catch (err) {
      if (
        err.name === 'CastError' &&
        err.kind === 'ObjectId' &&
        err.path === '_id'
      ) {
        return undefined;
      } else {
        throw err;
      }
    }
  }

  protected async addItemData(
    id: string,
    field: string,
    updateEntity: Partial<T> | string,
    rule?: FilterQuery<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    try {
      const condition: FilterQuery<T> = rule
        ? { ...rule, _id: id }
        : { _id: id };

      const res = await this.model
        .findOneAndUpdate(
          condition,
          { $push: { [field]: updateEntity } as any },
          { new: true }, // Retorna o documento atualizado
        )
        .exec();

      return res;
    } catch (err) {
      if (
        err.name === 'CastError' &&
        err.kind === 'ObjectId' &&
        err.path === '_id'
      ) {
        return undefined;
      } else {
        throw err;
      }
    }
  }

  protected async removeItemData(
    id: string,
    field: string,
    updateEntity: Partial<T> | string,
    rule?: FilterQuery<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    try {
      const condition: FilterQuery<T> = rule
        ? { ...rule, _id: id }
        : { _id: id };

      console.log({ [field]: updateEntity });
      const res = await this.model
        .findOneAndUpdate(
          condition,
          { $pull: { [field]: updateEntity } as any },
          { new: true }, // Retorna o documento atualizado
        )
        .exec();

      return res;
    } catch (err) {
      if (
        err.name === 'CastError' &&
        err.kind === 'ObjectId' &&
        err.path === '_id'
      ) {
        return undefined;
      } else {
        throw err;
      }
    }
  }
}
