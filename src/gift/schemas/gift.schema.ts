import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Schema as SchemaType } from 'mongoose';
import { Gift } from '../entities/gift.entity';
import { User } from 'src/users/entities/user.entity';

export type GiftDocument = HydratedDocument<GiftSchema>;

@Schema({ collection: 'gifts', timestamps: true })
export class GiftSchema extends Document implements Gift {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ type: SchemaType.Types.ObjectId, ref: 'UserSchema' })
  user: User;
}

export const GiftchemaFactory = SchemaFactory.createForClass(GiftSchema);
