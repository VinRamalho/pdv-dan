import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Schema as SchemaType } from 'mongoose';
import { Gift } from '../entities/gift.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { DataStatus } from 'src/data/dto/data.sto';

export type GiftDocument = HydratedDocument<GiftSchema>;

@Schema({ collection: 'gifts', timestamps: true })
export class GiftSchema
  extends Document
  implements Omit<Gift, '_id' | 'createdAt' | 'updatedAt'>
{
  @Prop({ type: Number, enum: DataStatus })
  status: DataStatus;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop({ type: SchemaType.Types.ObjectId, ref: 'UserSchema' })
  user: UserDto;
}

export const GiftchemaFactory = SchemaFactory.createForClass(GiftSchema);
