import { Module, RequestMethod } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
    BullModule.registerQueue({
      name: QueueDto.SEND_EMAIL,
    }),
  ],
  controllers: [],
  providers: [QueueMailService, QueueMailConsumer, UserService],
  exports: [QueueMailService, QueueMailConsumer],
})
export class QueueModule {
  constructor(@InjectQueue(QueueDto.SEND_EMAIL) private queue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.queue)]);
    consumer.apply(router).forRoutes('admin/queues');
  }
}
