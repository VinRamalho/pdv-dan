import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class Job {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  price: number;
  @IsOptional()
  user?: User;
}
