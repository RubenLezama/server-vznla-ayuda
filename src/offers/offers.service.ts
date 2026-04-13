import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OfferStatus, PostStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';
import { userPublicSelect } from '../users/user-public.select';

const offerInclude = {
  donor: {
    select: userPublicSelect,
  },
  post: {
    include: {
      author: {
        select: userPublicSelect,
      },
    },
  },
  chatRoom: true,
} satisfies Prisma.OfferInclude;

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(postId: string, donorId: string, dto: CreateOfferDto) {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id: postId },
      include: {
        author: {
          select: userPublicSelect,
        },
      },
    });

    if (post.authorId === donorId) {
      throw new BadRequestException(
        'No puedes ofertar en tu propia publicacion.',
      );
    }

    if (
      post.status !== PostStatus.OPEN &&
      post.status !== PostStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        'La publicacion ya no esta disponible para nuevas ofertas.',
      );
    }

    const offer = await this.prisma.$transaction(async (tx) => {
      const createdOffer = await tx.offer.create({
        data: {
          postId,
          donorId,
          message: dto.message?.trim(),
          quantityOffered: dto.quantityOffered ?? 1,
        },
      });

      await tx.chatRoom.create({
        data: {
          postId,
          offerId: createdOffer.id,
          donorId,
          ownerId: post.authorId,
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { status: PostStatus.IN_PROGRESS },
      });

      return tx.offer.findUniqueOrThrow({
        where: { id: createdOffer.id },
        include: offerInclude,
      });
    });

    return offer;
  }

  async findMyOffers(userId: string, kind: 'sent' | 'received' = 'sent') {
    return this.prisma.offer.findMany({
      where:
        kind === 'sent'
          ? { donorId: userId }
          : {
              post: {
                authorId: userId,
              },
            },
      include: offerInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(offerId: string, userId: string) {
    const offer = await this.prisma.offer.findUniqueOrThrow({
      where: { id: offerId },
      include: offerInclude,
    });

    if (offer.donorId !== userId && offer.post.authorId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta oferta.');
    }

    return offer;
  }

  async updateStatus(
    userId: string,
    offerId: string,
    dto: UpdateOfferStatusDto,
  ) {
    const offer = await this.prisma.offer.findUniqueOrThrow({
      where: { id: offerId },
      include: {
        post: true,
        chatRoom: true,
      },
    });

    const isOwner = offer.post.authorId === userId;
    const isDonor = offer.donorId === userId;

    if (
      (dto.status === OfferStatus.ACCEPTED ||
        dto.status === OfferStatus.REJECTED ||
        dto.status === OfferStatus.COMPLETED) &&
      !isOwner
    ) {
      throw new ForbiddenException(
        'Solo el autor de la publicacion puede cambiar a ese estado.',
      );
    }

    if (dto.status === OfferStatus.CANCELLED && !isOwner && !isDonor) {
      throw new ForbiddenException(
        'Solo los participantes pueden cancelar una oferta.',
      );
    }

    const nextPostStatus =
      dto.status === OfferStatus.REJECTED ||
      dto.status === OfferStatus.CANCELLED
        ? PostStatus.OPEN
        : dto.status === OfferStatus.COMPLETED
          ? offer.post.quantityFulfilled + offer.quantityOffered >=
            offer.post.quantityNeeded
            ? PostStatus.COMPLETED
            : PostStatus.IN_PROGRESS
          : PostStatus.IN_PROGRESS;

    return this.prisma.$transaction(async (tx) => {
      const updatedOffer = await tx.offer.update({
        where: { id: offerId },
        data: {
          status: dto.status,
          acceptedAt:
            dto.status === OfferStatus.ACCEPTED ? new Date() : offer.acceptedAt,
          completedAt:
            dto.status === OfferStatus.COMPLETED
              ? new Date()
              : offer.completedAt,
        },
        include: offerInclude,
      });

      await tx.post.update({
        where: { id: offer.postId },
        data: {
          status: nextPostStatus,
          quantityFulfilled:
            dto.status === OfferStatus.COMPLETED
              ? {
                  increment: offer.quantityOffered,
                }
              : undefined,
        },
      });

      if (
        dto.status === OfferStatus.REJECTED ||
        dto.status === OfferStatus.CANCELLED ||
        dto.status === OfferStatus.COMPLETED
      ) {
        await tx.chatRoom.updateMany({
          where: { offerId },
          data: {
            isOpen: dto.status !== OfferStatus.COMPLETED,
          },
        });
      }

      return updatedOffer;
    });
  }
}
