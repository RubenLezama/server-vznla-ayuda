import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { OfferStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { userPublicSelect } from '../users/user-public.select';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, dto: CreateReviewDto) {
    const offer = await this.prisma.offer.findUniqueOrThrow({
      where: { id: dto.offerId },
      include: {
        post: true,
        donor: {
          select: userPublicSelect,
        },
        reviews: true,
      },
    });

    if (offer.status !== OfferStatus.COMPLETED) {
      throw new BadRequestException(
        'Solo puedes valorar una donacion completada.',
      );
    }

    if (offer.post.authorId !== authorId) {
      throw new ForbiddenException(
        'Solo quien recibio la ayuda puede dejar la valoracion.',
      );
    }

    if (offer.reviews.some((review) => review.authorId === authorId)) {
      throw new BadRequestException(
        'Ya dejaste una valoracion para esta donacion.',
      );
    }

    return this.prisma.review.create({
      data: {
        offerId: dto.offerId,
        authorId,
        targetUserId: offer.donorId,
        rating: dto.rating,
        comment: dto.comment?.trim(),
      },
      include: {
        author: {
          select: userPublicSelect,
        },
        targetUser: {
          select: userPublicSelect,
        },
      },
    });
  }

  findReceived(userId: string) {
    return this.prisma.review.findMany({
      where: {
        targetUserId: userId,
      },
      include: {
        author: {
          select: userPublicSelect,
        },
        offer: {
          include: {
            post: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
