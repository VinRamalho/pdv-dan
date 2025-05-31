import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Schema as SchemaType } from 'mongoose';
import { User } from '../entities/user.entity';
import { Role } from 'src/permission/dto/permission.dto';
import { DataStatus } from 'src/data/dto/data.dto';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ collection: 'users', timestamps: true })
export class UserSchema
  extends Document
  implements Omit<User, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ type: Number, enum: DataStatus })
  status: DataStatus;

  @Prop()
  name: string;

  @Prop({ unique: true, index: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  roles: Role[];
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
