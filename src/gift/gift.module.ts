import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftSchema, GiftchemaFactory } from './schemas/gift.schema';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { UserSchema, UserSchemaFactory } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiftSchema.name, schema: GiftchemaFactory },
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
  ],
  controllers: [GiftController],
  providers: [GiftService, UserService],
  exports: [GiftService],
})
export class GiftModule {}
