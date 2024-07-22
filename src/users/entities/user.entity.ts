import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Gift } from 'src/gift/entities/gift.entity';
import { Role } from 'src/permission/dto/permission.dto';

export class User {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'E-mail invalid' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  roles: Role[];

  @ApiProperty()
  @IsOptional()
  gifts?: Gift[];
}
