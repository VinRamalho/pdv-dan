import { IsNotEmpty, IsOptional } from 'class-validator';
import { PDV } from '../entities/pdv.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PDVDto extends PDV {}

export class CreatePDVDto {
  @ApiProperty()
  @IsNotEmpty()
  supplier: string;

  @ApiProperty()
  @IsNotEmpty()
  purchaser: string;

  @ApiProperty()
  @IsNotEmpty()
  shipTo: string;

  @ApiProperty({ required: false })
  @IsOptional()
  freeText: string;

  @ApiProperty({ required: false })
  @IsOptional()
  products?: AddProductDto[];
}

export class AddProductDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  discount: number;
}
