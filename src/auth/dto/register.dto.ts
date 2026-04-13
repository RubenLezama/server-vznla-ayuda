import { AccountType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  firstName: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  lastName: string;

  @ApiProperty({ example: 'juan@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123*', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ enum: AccountType, example: AccountType.PERSON })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiPropertyOptional({ example: 'Fundacion Esperanza' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  organizationName?: string;
}
