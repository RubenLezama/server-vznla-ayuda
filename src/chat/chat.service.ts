import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { userPublicSelect } from '../users/user-public.select';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  listRooms(userId: string) {
    return this.prisma.chatRoom.findMany({
      where: {
        OR: [{ donorId: userId }, { ownerId: userId }],
      },
      include: {
        donor: { select: userPublicSelect },
        owner: { select: userPublicSelect },
        post: true,
        offer: true,
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: userPublicSelect,
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(userId: string, roomId: string) {
    await this.assertRoomAccess(userId, roomId);

    return this.prisma.message.findMany({
      where: { roomId },
      include: {
        sender: { select: userPublicSelect },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createMessage(userId: string, roomId: string, dto: CreateMessageDto) {
    await this.assertRoomAccess(userId, roomId);

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          roomId,
          senderId: userId,
          body: dto.body.trim(),
        },
        include: {
          sender: { select: userPublicSelect },
        },
      });

      await tx.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() },
      });

      return message;
    });
  }

  async assertRoomAccess(userId: string, roomId: string) {
    const room = await this.prisma.chatRoom.findUniqueOrThrow({
      where: { id: roomId },
      select: {
        id: true,
        donorId: true,
        ownerId: true,
      },
    });

    if (room.donorId !== userId && room.ownerId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta sala.');
    }

    return room;
  }
}
