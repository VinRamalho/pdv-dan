import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueDto } from '../dto/queue.dto';
import { Queue } from 'bull';
import {
  PaymentDto,
  IPaymentProcessReq,
  ICardPaymentProcessReq,
} from './dto/payment.dto';

@Injectable()
export class QueueProcessPaymentService {
  constructor(@InjectQueue(QueueDto.PROCESS_PAYMENT) private queue: Queue) {}

  async pay(data: IPaymentProcessReq) {
    await this.queue.add(PaymentDto.PAYMENT, data);
  }

  async cardPay(data: ICardPaymentProcessReq) {
    await this.queue.add(PaymentDto.CARD_PAY, data);
  }
}
