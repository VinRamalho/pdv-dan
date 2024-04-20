import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema, JobSchemaFactory } from './schemas/job.schema';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { UserSchema, UserSchemaFactory } from 'src/users/schemas/user.schema';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobSchema.name, schema: JobSchemaFactory },
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
  ],
  controllers: [JobController],
  providers: [JobService, UserService],
  exports: [JobService],
})
export class JobsModule {}
