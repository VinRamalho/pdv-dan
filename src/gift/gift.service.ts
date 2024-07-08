import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { GiftDocument, GiftSchema } from './schemas/gift.schema';
import { Crud } from 'src/crud/crud.abstract';

@Injectable()
export class GiftService extends Crud<GiftSchema> {
  constructor(
    @InjectModel(GiftSchema.name)
    private readonly giftService: Model<GiftSchema>,
  ) {
    super(giftService);
  }

  async findById(
    id: string,
  ): Promise<HydratedDocument<GiftDocument> | undefined> {
    const res = await super.findById(id, 'user', ['name', '_id']);

    return res;
  }

  async findAll(): Promise<HydratedDocument<GiftDocument>[] | undefined> {
    const res = await super.findAll('user', ['name', 'email']);

    return res;
  }

  async findByUserId(userId: string) {
    const res = await super.findByField({ user: userId } as any, 'user', [
      'name',
      'email',
    ]);

    return res;
  }
}
