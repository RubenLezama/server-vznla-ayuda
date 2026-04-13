import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Perfecto, puedo entregar los insumos manana a las 3 PM.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  body: string;
}
