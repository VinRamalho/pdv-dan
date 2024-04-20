import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JobSchema, JobSchemaFactory } from 'src/job/schemas/job.schema';
import { QueueMailService } from 'src/queue/mail/mail.producer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: JobSchema.name, schema: JobSchemaFactory },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
