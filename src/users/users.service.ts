import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { userPublicSelect } from './user-public.select';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: userPublicSelect,
    });
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        bio: dto.bio,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        organizationName: dto.organizationName,
      },
      select: userPublicSelect,
    });
  }
}
