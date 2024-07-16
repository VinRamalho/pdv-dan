import { Module } from '@nestjs/common';
import { QueueMailService } from 'src/queue/mail/mail.producer.service';
import { QueueMailConsumer } from './mail/mail.consumer';
import { UserService } from 'src/users/user.service';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { QueueDto } from './dto/queue.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaFactory } from 'src/users/schemas/user.schema';
import { Queue } from 'bull';
import { MiddlewareBuilder } from '@nestjs/core';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { PaymentModule } from 'src/payments/payment.module';
import { QueueProcessPaymentService } from './payment/payment.producer.service';
import { QueueProcessPaymentlConsumer } from './payment/payment.consumer';
import { GiftService } from 'src/gift/gift.service';
import { GiftchemaFactory, GiftSchema } from 'src/gift/schemas/gift.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: GiftSchema.name, schema: GiftchemaFactory },
    ]),
    BullModule.registerQueue({
      name: QueueDto.SEND_EMAIL,
    }),
    BullModule.registerQueue({
      name: QueueDto.PROCESS_PAYMENT,
    }),
    PaymentModule,
  ],
  controllers: [],
  providers: [
    QueueMailService,
    QueueMailConsumer,
    QueueProcessPaymentService,
    QueueProcessPaymentlConsumer,
    UserService,
    GiftService,
  ],
  exports: [
    QueueMailService,
    QueueMailConsumer,
    QueueProcessPaymentService,
    QueueProcessPaymentlConsumer,
  ],
})
export class QueueModule {
  constructor(
    @InjectQueue(QueueDto.SEND_EMAIL) private queueSendMail: Queue,
    @InjectQueue(QueueDto.PROCESS_PAYMENT) private queueProcessPayment: Queue,
  ) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([
      new BullAdapter(this.queueSendMail),
      new BullAdapter(this.queueProcessPayment),
    ]);
    consumer.apply(router).forRoutes('admin/queues');
  }
}
