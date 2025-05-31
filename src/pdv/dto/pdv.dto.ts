import { IsNotEmpty } from 'class-validator';
import { PDV } from '../entities/pdv.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PDVDto extends PDV {}

export class CreatePDVDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;
}

export class AddProductDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
}
