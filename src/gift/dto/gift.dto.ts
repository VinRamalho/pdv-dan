import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gift } from '../entities/gift.entity';
import { IsOptional } from 'class-validator';

export class GiftDto extends Gift {}

export class PayCartReqGiftDto {
  @ApiProperty()
  ids: string[];
}

export class PayReqGiftDto {
  @ApiProperty({ nullable: true, default: 1 })
  @IsOptional()
  quantity?: number;
}
