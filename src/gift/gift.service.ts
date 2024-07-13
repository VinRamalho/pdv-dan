import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { GiftDocument, GiftSchema } from './schemas/gift.schema';
import { Crud } from 'src/crud/crud.abstract';
import { UserDocument } from 'src/users/schemas/user.schema';
import { PaymentService } from 'src/payments/payment.service';
import { Payment } from 'src/payments/dto/payment.dto';
import { UserService } from 'src/users/user.service';
import { v4 as uuidv4 } from 'uuid';

const PAYMENT_TEST = {
  credit_card: {
    card: {
      number: '4000000000000010',
      holder_name: 'TonyStark',
      exp_month: 1,
      exp_year: 30,
      cvv: '3531',
      brand: 'Mastercard',
    },
    operation_type: 'auth_only',
    installments: 1,
    statement_descriptor: 'presente de casamento',
  },
  payment_method: 'credit_card',
};

@Injectable()
export class GiftService extends Crud<GiftSchema> {
  constructor(
    @InjectModel(GiftSchema.name)
    private readonly giftService: Model<GiftSchema>,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
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

  async processPayment(id: string, userId: string) {
    const item = await this.giftService.findById(id);

    if (!item) {
      throw new NotFoundException(`Not found Gift: ${id}`);
    }

    const userGift = item.user as UserDocument;

    if (String(userGift._id) !== userId) {
      throw new UnauthorizedException('Oops! you are not allowed to do this');
    }

    const { _id: itemId, price, description } = item;
    const { email, name } = await this.userService.findById(userId);
    const code = uuidv4();
    const payment: Payment = {
      code,
      customer: {
        email,
        name,
        type: 'individual',
      },
      items: [
        {
          code: itemId,
          amount: price,
          description,
          quantity: 1,
        },
      ],
      payments: [PAYMENT_TEST],
    };

    const res = await this.paymentService.createOrder(payment);
    return res;
  }
}
