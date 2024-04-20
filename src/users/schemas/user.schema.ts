import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Schema as SchemaType } from 'mongoose';
import { User } from '../entities/user.entity';
import { Job } from 'src/job/entities/job.entity';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ collection: 'users', timestamps: true })
export class UserSchema extends Document implements User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  roles: string[];

  @Prop({ type: [{ type: SchemaType.Types.ObjectId, ref: 'JobSchema' }] })
  jobs?: Job[];
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
