import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DataModel } from 'src/data/dto/data.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class Gift extends DataModel {
  constructor(model: Partial<Gift>) {
    super();
    Object.assign(this, model);
  }

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsOptional()
  user?: UserDto;
}
