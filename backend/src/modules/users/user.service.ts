import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async updateUser(userId: number, data: Prisma.UsersUpdateInput) {
    if (data.emergencyContact) {
      data.emergencyContact = JSON.stringify(data.emergencyContact);
    }

    return await prisma.users.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        role: true,
        status: true,
        emergencyContact: true,
        createdAt: true,
        updatedAt: true,
        preferences: true,
        membershipTier: true,
        loyaltyPoints: true
      }
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
        dateOfBirth: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
} 