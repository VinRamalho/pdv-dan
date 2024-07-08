import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Gift } from 'src/gift/entities/gift.entity';

export class User {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'E-mail invalid' })
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  roles: string[];
  @IsOptional()
  gifts?: Gift[];
}
