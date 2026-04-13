import { OfferStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateOfferStatusDto {
  @ApiProperty({ enum: OfferStatus, example: OfferStatus.ACCEPTED })
  @IsEnum(OfferStatus)
  status: OfferStatus;
}
