import { Module } from '@nestjs/common';
import { QueueMailService } from 'src/queue/mail/mail.producer.service';
import { QueueMailConsumer } from './mail/mail.consumer';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [QueueMailService, QueueMailConsumer, UserService],
  exports: [QueueMailService, QueueMailConsumer],
})
export class QueueModule {}
