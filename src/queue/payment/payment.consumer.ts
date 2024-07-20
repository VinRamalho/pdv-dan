import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  PaymentDto,
  IPaymentProcessReq,
  ICardPaymentProcessReq,
} from './dto/payment.dto';
import { UserService } from 'src/users/user.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { QueueDto } from '../dto/queue.dto';
import {
  CustomerType,
  OperationType,
  IPayment,
  IPaymentMethod,
} from 'src/payments/dto/payment.dto';
import { PaymentService } from 'src/payments/payment.service';
import { v4 as uuidv4 } from 'uuid';
import { GiftService } from 'src/gift/gift.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GiftDocument } from 'src/gift/schemas/gift.schema';

const PAYMENT_TEST = (amount?: number): IPaymentMethod => {
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
      operation_type: OperationType.AUTH_ONLY,
      installments: 1,
      statement_descriptor: 'pres casamen',
    },
    payment_method: 'credit_card',
    amount,
  };
};

@Processor(QueueDto.PROCESS_PAYMENT)
export class QueueProcessPaymentlConsumer {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly giftService: GiftService,
  ) {}

  @Process(PaymentDto.PAYMENT)
  async pay(job: Job<IPaymentProcessReq>) {
    const { id, userId, quantity } = job.data;

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
    const payment: IPayment = {
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
          description,
          quantity,
        },
      ],
      payments: [PAYMENT_TEST(price * 100 * quantity)],
    };

    const res = await this.paymentService.createOrder(payment);

    return res;
  }

  @Process(PaymentDto.CARD_PAY)
  async cardPay(job: Job<ICardPaymentProcessReq>) {
    const QUANTITY = 1;

    const { ids, userId } = job.data;

    const items = await this.giftService.findByIds(ids);

    if (!items) {
      throw new NotFoundException(`Not found Gift: ${ids}`);
    }

    const userGift = items.map((item) => item.user as UserDocument);

    if (userGift.some((item) => String(item._id) !== userId)) {
      throw new UnauthorizedException('Oops! you are not allowed to do this');
    }

    const itemsPay = items.map(({ description, price, _id }: GiftDocument) => ({
      code: _id,
      amount: price * 100 * QUANTITY,
      description,
      quantity: QUANTITY,
    }));

    const { email, name } = await this.userService.findById(userId);
    const code = uuidv4();
    const payment: IPayment = {
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
      items: itemsPay,
      payments: [PAYMENT_TEST()],
    };

    const res = await this.paymentService.createOrder(payment);

    return res;
  }
}
