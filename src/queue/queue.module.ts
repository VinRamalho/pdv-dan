import { Module } from '@nestjs/common';
import { QueueMailService } from 'src/queue/mail/mail.producer.service';
import { QueueMailConsumer } from './mail/mail.consumer';

@Module({
  imports: [],
  controllers: [],
  providers: [QueueMailService, QueueMailConsumer],
  exports: [QueueMailService, QueueMailConsumer],
})
export class QueueModule {}
