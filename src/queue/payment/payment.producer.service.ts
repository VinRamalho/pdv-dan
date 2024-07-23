import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueDto } from '../dto/queue.dto';
import { Queue } from 'bull';
import {
  PaymentDto,
  IPaymentProcessReq,
  ICartPaymentProcessReq,
} from './dto/payment.dto';

@Injectable()
export class QueueProcessPaymentService {
  constructor(@InjectQueue(QueueDto.PROCESS_PAYMENT) private queue: Queue) {}

  async pay(data: IPaymentProcessReq) {
    await this.queue.add(PaymentDto.PAYMENT, data);
  }

  async cartPay(data: ICartPaymentProcessReq) {
    await this.queue.add(PaymentDto.CART_PAY, data);
  }
}
