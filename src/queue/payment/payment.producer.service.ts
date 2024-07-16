import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueDto } from '../dto/queue.dto';
import { Queue } from 'bull';
import { PaymentDto, PaymentProcessReq } from './dto/payment.dto';

@Injectable()
export class QueueProcessPaymentService {
  constructor(@InjectQueue(QueueDto.PROCESS_PAYMENT) private queue: Queue) {}

  async send(data: PaymentProcessReq) {
    await this.queue.add(PaymentDto.PAYMENT, data);
  }
}
