import { PostCategory, PostType, UrgencyLevel } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsArray
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Solicitud de medicinas para clinica comunitaria' })
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title: string;

  @ApiProperty({
    example:
      'Necesitamos insulina, vendas y gasas para pacientes de atencion primaria en El Valle.',
  })
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description: string;

  @ApiProperty({ enum: PostType, example: PostType.REQUEST })
  @IsEnum(PostType)
  type: PostType;

  @ApiProperty({ enum: PostCategory, example: PostCategory.MEDICINE })
  @IsEnum(PostCategory)
  category: PostCategory;

  @ApiPropertyOptional({ enum: UrgencyLevel, example: UrgencyLevel.CRITICAL })
  @IsOptional()
  @IsEnum(UrgencyLevel)
  urgency?: UrgencyLevel;

  @ApiPropertyOptional({ example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantityNeeded?: number;

  @ApiPropertyOptional({ example: 'Caracas' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @ApiPropertyOptional({ example: 'Distrito Capital' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  state?: string;

  @ApiPropertyOptional({ example: 'Venezuela' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: '2026-12-31T00:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  deadline?: Date;

  @ApiPropertyOptional({ example: 'Fundación Esperanza' })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiPropertyOptional({ example: '+58 414 1234567' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'WhatsApp' })
  @IsOptional()
  @IsString()
  contactPreference?: string;

  @ApiPropertyOptional({ example: ['data:image/png;base64,...'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

}
