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
import {
  CustomerType,
  OperationType,
  Payment,
  PaymentMethod,
} from 'src/payments/dto/payment.dto';
import { UserService } from 'src/users/user.service';
import { v4 as uuidv4 } from 'uuid';

const PAYMENT_TEST = (amount: number): PaymentMethod => {
  return {
    credit_card: {
      card: {
        number: '4000000000000010',
        holder_name: 'Tony Stark',
        exp_month: 1,
        exp_year: 30,
        cvv: '3531',
        brand: 'Mastercard',
        billing_address: {
          street: 'Malibu Point',
          number: '10880',
          zip_code: '90265',
          neighborhood: 'Malibu Central',
          city: 'Malibu',
          state: 'CA',
          country: 'US',
          line_1: '10880, Malibu Point, Malibu Central',
        },
      },
      operation_type: OperationType.AUTH_AND_CAPTURE,
      installments: 1,
      statement_descriptor: 'pres casamen',
    },
    payment_method: 'credit_card',
    amount,
  };
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
        type: CustomerType.PERSON,
        document: '11304917908',
        phones: {
          mobile_phone: {
            area_code: '41',
            country_code: '55',
            number: '997987818',
          },
        },
      },
      items: [
        {
          code: itemId,
          amount: price * 100,
          description:
            description.length > 13 ? description.slice(0, 12) : description,
          quantity: 1,
        },
      ],
      payments: [PAYMENT_TEST(price * 100 * 1)],
    };

    const res = await this.paymentService.createOrder(payment);
    return res;
  }
}
