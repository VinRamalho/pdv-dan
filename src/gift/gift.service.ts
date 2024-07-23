import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { GiftDocument, GiftSchema } from './schemas/gift.schema';
import { Crud } from 'src/crud/crud.abstract';
import { QueueProcessPaymentService } from 'src/queue/payment/payment.producer.service';

@Injectable()
export class GiftService extends Crud<GiftSchema> {
  constructor(
    @InjectModel(GiftSchema.name)
    private readonly giftModel: Model<GiftSchema>,
    private readonly queueProcessPayment: QueueProcessPaymentService,
  ) {
    super(giftModel);
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
    const res = await super.findMultiByField({ user: userId } as any, 'user', [
      'name',
      'email',
    ]);

    return res;
  }

  async processPayment(id: string, userId: string, quantity: number) {
    await this.queueProcessPayment.pay({ id, userId, quantity });
  }

  async processCartPayment(ids: string[], userId: string) {
    await this.queueProcessPayment.cartPay({ ids, userId });
  }
}
