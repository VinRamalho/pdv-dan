import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Job } from 'src/job/entities/job.entity';

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
  jobs?: Job[];
}
