import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Schema as SchemaType } from 'mongoose';
import { Job } from '../entities/job.entity';
import { User } from 'src/users/entities/user.entity';

export type JobDocument = HydratedDocument<JobSchema>;

@Schema({ collection: 'job', timestamps: true })
export class JobSchema extends Document implements Job {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ type: SchemaType.Types.ObjectId, ref: 'UserSchema' })
  user: User;
}

export const JobSchemaFactory = SchemaFactory.createForClass(JobSchema);
