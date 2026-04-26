import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { userPublicSelect } from '../users/user-public.select';
import * as bcrypt from 'bcryptjs';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';

const AUTH_SESSION_TTL_SECONDS = 24 * 60 * 60;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este correo.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        accountType: dto.accountType,
        organizationName: dto.organizationName?.trim(),
      },
      select: userPublicSelect,
    });

    return {
      user,
      ...(await this.buildAuthResponse(user)),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('No existe una cuenta con este correo.');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('La contrasena es incorrecta.');
    }

    const publicUser = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: userPublicSelect,
    });

    return {
      user: publicUser,
      ...(await this.buildAuthResponse(publicUser)),
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: userPublicSelect,
    });
  }

  private async buildAuthResponse(user: {
    id: string;
    email: string;
    accountType: 'PERSON' | 'ORGANIZATION';
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      accountType: user.accountType,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: AUTH_SESSION_TTL_SECONDS,
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: AUTH_SESSION_TTL_SECONDS,
    };
  }
}
