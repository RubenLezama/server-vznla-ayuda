import {
  AccountType,
  PostCategory,
  PostStatus,
  PostType,
  PrismaClient,
  UrgencyLevel,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123*', 10);

  const donor = await prisma.user.upsert({
    where: { email: 'donante@venezuela-ayuda.org' },
    update: {},
    create: {
      email: 'donante@venezuela-ayuda.org',
      passwordHash,
      firstName: 'Alejandro',
      lastName: 'Morales',
      accountType: AccountType.PERSON,
      city: 'Caracas',
      state: 'Distrito Capital',
    },
  });

  const requester = await prisma.user.upsert({
    where: { email: 'clinica@venezuela-ayuda.org' },
    update: {},
    create: {
      email: 'clinica@venezuela-ayuda.org',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Rivas',
      organizationName: 'Clinica Comunitaria El Valle',
      accountType: AccountType.ORGANIZATION,
      city: 'Caracas',
      state: 'Distrito Capital',
    },
  });

  const existingPost = await prisma.post.findFirst({
    where: { title: 'Solicitud de medicinas para clinica comunitaria' },
  });

  if (!existingPost) {
    await prisma.post.createMany({
      data: [
        {
          title: 'Solicitud de medicinas para clinica comunitaria',
          description:
            'Necesitamos insulina, vendas y gasas para pacientes de atencion primaria en El Valle.',
          type: PostType.REQUEST,
          status: PostStatus.OPEN,
          category: PostCategory.MEDICINE,
          urgency: UrgencyLevel.CRITICAL,
          quantityNeeded: 10,
          quantityFulfilled: 0,
          city: 'Caracas',
          state: 'Distrito Capital',
          authorId: requester.id,
        },
        {
          title: 'Donacion de ropa en buen estado',
          description:
            'Tengo ropa para ninos y adultos lista para entregar en Caracas.',
          type: PostType.DONATION,
          status: PostStatus.OPEN,
          category: PostCategory.CLOTHING,
          urgency: UrgencyLevel.MEDIUM,
          quantityNeeded: 20,
          quantityFulfilled: 0,
          city: 'Caracas',
          state: 'Distrito Capital',
          authorId: donor.id,
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
