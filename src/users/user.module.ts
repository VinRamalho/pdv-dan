import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GiftSchema, GiftchemaFactory } from 'src/gift/schemas/gift.schema';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: GiftSchema.name, schema: GiftchemaFactory },
    ]),
    QueueModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
