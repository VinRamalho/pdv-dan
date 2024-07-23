import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Crud } from 'src/crud/crud.abstract';
import { UserDocument, UserSchema } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService extends Crud<UserSchema> {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
  ) {
    super(userModel);
  }

  async create(createUserDto: UserDto) {
    const { password } = createUserDto;

    const passwordHash = await hash(password, 12);

    const user: UserDto = { ...createUserDto, password: passwordHash };

    return await super.create(user);
  }

  async findByEmail(username: string) {
    const res = await super.findByField({ email: username });

    return res;
  }

  async findById(
    id: string,
  ): Promise<HydratedDocument<UserDocument> | undefined> {
    const res = await super.findById(id, 'gifts');

    return res;
  }
}
