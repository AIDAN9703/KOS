import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async updateUser(userId: number, data: Prisma.UsersUpdateInput) {
    return await prisma.users.update({
      where: { id: userId },
      data
    });
  }

  async getAllUsers() {
    return await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
} 