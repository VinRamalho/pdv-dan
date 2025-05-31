import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DataModel } from 'src/data/dto/data.dto';

export class Product extends DataModel {
  constructor(model: Partial<Product>) {
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
}
