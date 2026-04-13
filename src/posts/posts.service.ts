import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, PostStatus, UrgencyLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { userPublicSelect } from '../users/user-public.select';

const postInclude = {
  author: {
    select: userPublicSelect,
  },
  _count: {
    select: {
      offers: true,
    },
  },
} satisfies Prisma.PostInclude;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(authorId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        type: dto.type,
        category: dto.category,
        urgency: dto.urgency ?? UrgencyLevel.MEDIUM,
        quantityNeeded: dto.quantityNeeded ?? 1,
        city: dto.city?.trim(),
        state: dto.state?.trim(),
        country: dto.country?.trim() ?? 'Venezuela',
        authorId,
      },
      include: postInclude,
    });
  }

  findAll(query: QueryPostsDto) {
    const where: Prisma.PostWhereInput = {
      type: query.type,
      category: query.category,
      status: query.status ?? PostStatus.OPEN,
      urgency: query.urgency,
      authorId: query.authorId,
      city: query.city
        ? {
            contains: query.city,
            mode: 'insensitive',
          }
        : undefined,
      OR: query.search
        ? [
            {
              title: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query.search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    };

    return this.prisma.post.findMany({
      where,
      include: postInclude,
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUniqueOrThrow({
      where: { id },
      include: {
        ...postInclude,
        offers: {
          orderBy: { createdAt: 'desc' },
          include: {
            donor: {
              select: userPublicSelect,
            },
          },
        },
      },
    });
  }

  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUniqueOrThrow({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Solo el autor puede actualizar esta publicacion.',
      );
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title?.trim(),
        description: dto.description?.trim(),
        type: dto.type,
        category: dto.category,
        urgency: dto.urgency,
        quantityNeeded: dto.quantityNeeded,
        city: dto.city?.trim(),
        state: dto.state?.trim(),
        country: dto.country?.trim(),
      },
      include: postInclude,
    });
  }
}
