// crud.abstract.ts
import { Injectable } from '@nestjs/common';
import { Model, Document, HydratedDocument, FilterQuery } from 'mongoose';
import { Data } from 'src/data/data.abstract';

@Injectable()
export abstract class Crud<T extends Document> extends Data<T> {
  constructor(model: Model<T>) {
    super(model);
  }

  async create(entity: Partial<T>): Promise<HydratedDocument<T>> {
    return await super.createData(entity);
  }

  async findAll(
    populate?: string,
    fieldsPopulate?: string[],
  ): Promise<HydratedDocument<T>[]> {
    return await super.findDataAll(populate, fieldsPopulate);
  }

  async findById(
    id: string,
    populate?: string,
    fieldsPopulate?: string[],
  ): Promise<HydratedDocument<T> | undefined> {
    return await super.findDataById(id, populate, fieldsPopulate);
  }

  async findByField(
    field: Partial<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    return await super.findDataByField(field);
  }

  async update(
    id: string,
    updateEntity: Partial<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    return await super.updateData(id, updateEntity);
  }

  async set(
    id: string,
    updateEntity: Partial<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    return await super.setData(id, updateEntity);
  }

  async delete(id: string) {
    return await super.deleteData(id);
  }

  async addItemById(
    id: string,
    field: string,
    updateEntity: Partial<T> | string,
    rule?: FilterQuery<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    return await super.addItemData(id, field, updateEntity, rule);
  }

  async removeItemById(
    id: string,
    field: string,
    updateEntity: Partial<T> | string,
    rule?: FilterQuery<T>,
  ): Promise<HydratedDocument<T> | undefined> {
    return await super.removeItemData(id, field, updateEntity, rule);
  }
}
