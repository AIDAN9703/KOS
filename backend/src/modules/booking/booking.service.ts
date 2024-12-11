import { PrismaClient, Prisma, BookingStatus, PaymentStatus } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export class BookingService {
  async createBooking(data: Prisma.BookingsUncheckedCreateInput) {
    // Check if boat exists
    const boat = await prisma.boats.findUnique({
      where: { id: data.boatId }
    });

    if (!boat) {
      throw new Error('Boat not found');
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.bookings.findFirst({
      where: {
        boatId: data.boatId,
        status: 'CONFIRMED',
        OR: [
          {
            startDate: {
              gte: data.startDate,
              lte: data.endDate
            }
          },
          {
            endDate: {
              gte: data.startDate,
              lte: data.endDate
            }
          }
        ]
      }
    });

    if (conflictingBooking) {
      throw new Error('Selected time slot is not available');
    }

    return prisma.bookings.create({
      data: {
        ...data,
        startTime: format(new Date(data.startDate), 'HH:mm'),
        endTime: format(new Date(data.endDate), 'HH:mm'),
      },
      include: {
        boat: true,
        boatPrice: true,
        user: true
      }
    });
  }

  async getUserBookings(userId: number) {
    return await prisma.bookings.findMany({
      where: { userId },
      include: {
        boat: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });
  }

  async updateBookingStatus(
    bookingId: number,
    status: BookingStatus,
    paymentStatus: PaymentStatus
  ) {
    const booking = await prisma.bookings.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    return await prisma.bookings.update({
      where: { id: bookingId },
      data: { status, paymentStatus }
    });
  }

  async cancelBooking(bookingId: number, userId: number) {
    const booking = await prisma.bookings.findFirst({
      where: {
        id: bookingId,
        userId
      }
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    return await prisma.bookings.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED'
      }
    });
  }
} 