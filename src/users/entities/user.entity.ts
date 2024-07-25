import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { DataModel } from 'src/data/dto/data.sto';
import { Gift } from 'src/gift/entities/gift.entity';
import { Role } from 'src/permission/dto/permission.dto';

export class User extends DataModel {
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
