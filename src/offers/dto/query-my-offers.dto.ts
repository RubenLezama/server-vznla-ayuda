import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class QueryMyOffersDto {
  @ApiPropertyOptional({ enum: ['sent', 'received'], example: 'sent' })
  @IsOptional()
  @IsIn(['sent', 'received'])
  kind?: 'sent' | 'received';
}
