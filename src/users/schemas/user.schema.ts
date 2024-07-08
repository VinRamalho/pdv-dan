import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Schema as SchemaType } from 'mongoose';
import { User } from '../entities/user.entity';
import { Gift } from 'src/gift/entities/gift.entity';

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

  @Prop({ type: [{ type: SchemaType.Types.ObjectId, ref: 'GiftSchema' }] })
  gifts?: Gift[];
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
