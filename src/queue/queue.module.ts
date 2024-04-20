import { Module } from '@nestjs/common';
import { QueueMailService } from 'src/queue/mail/mail.producer.service';
import { QueueMailConsumer } from './mail/mail.consumer';
import { UserService } from 'src/users/user.service';
import { BullModule } from '@nestjs/bull';
import { QueueDto } from './dto/queue.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaFactory } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_ROUTE,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: QueueDto.SEND_EMAIL,
    }),
  ],
  controllers: [],
  providers: [QueueMailService, QueueMailConsumer, UserService],
  exports: [QueueMailService, QueueMailConsumer],
})
export class QueueModule {}
