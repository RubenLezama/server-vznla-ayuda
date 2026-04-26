import { Prisma } from '@prisma/client';

export const userPublicSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  organizationName: true,
  accountType: true,
  phone: true,
  bio: true,
  city: true,
  state: true,
  country: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});
