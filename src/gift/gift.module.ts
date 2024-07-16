import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftSchema, GiftchemaFactory } from './schemas/gift.schema';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { UserSchema, UserSchemaFactory } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/user.service';
import { PaymentService } from 'src/payments/payment.service';
import { HttpModule } from '@nestjs/axios';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiftSchema.name, schema: GiftchemaFactory },
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
    HttpModule,
    QueueModule,
  ],
  controllers: [GiftController],
  providers: [GiftService, UserService, PaymentService],
  exports: [GiftService],
})
export class GiftModule {}
