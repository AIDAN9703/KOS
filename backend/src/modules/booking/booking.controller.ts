import { Request, Response } from 'express';
import { BookingService } from './booking.service.js';
import { Prisma, BookingStatus, PaymentStatus } from '@prisma/client';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  async createBooking(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { 
        boatId, 
        startDate, 
        duration, 
        totalPrice, 
        specialRequests, 
        boatPriceId,
        guestCount,
        addOns
      } = req.body;

      // Input validation
      if (!boatId || !startDate || !duration || !totalPrice || !boatPriceId) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['boatId', 'startDate', 'duration', 'totalPrice', 'boatPriceId']
        });
      }

      const parsedStartDate = new Date(startDate);
      const endDate = new Date(parsedStartDate.getTime() + duration * 60 * 60 * 1000);

      const bookingData: Prisma.BookingsUncheckedCreateInput = {
        userId: req.user.id,
        boatId: Number(boatId),
        boatPriceId: Number(boatPriceId),
        startDate: parsedStartDate,
        endDate,
        duration: Number(duration),
        totalPrice: new Prisma.Decimal(totalPrice),
        specialRequests,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        guestCount: guestCount ? Number(guestCount) : undefined,
        addOns: addOns || {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const booking = await this.bookingService.createBooking(bookingData);
      return res.status(201).json(booking);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Boat not found') {
          return res.status(404).json({ error: 'Boat not found' });
        }
        if (error.message === 'Selected time slot is not available') {
          return res.status(409).json({ error: 'Time slot is not available' });
        }
      }
      console.error('Booking creation error:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  async getUserBookings(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const bookings = await this.bookingService.getUserBookings(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, paymentStatus } = req.body;

      const booking = await this.bookingService.updateBookingStatus(
        Number(id),
        status as BookingStatus,
        paymentStatus as PaymentStatus
      );
      res.json(booking);
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Failed to update booking status' });
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const booking = await this.bookingService.cancelBooking(
        Number(req.params.id),
        req.user.id
      );
      res.json(booking);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  }

  async handlePaymentEvent(event: any) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.bookingService.updateBookingStatus(
            Number(event.data.object.metadata.bookingId),
            'CONFIRMED',
            'SUCCEEDED'
          );
          break;
        case 'payment_intent.payment_failed':
          await this.bookingService.updateBookingStatus(
            Number(event.data.object.metadata.bookingId),
            'CANCELLED',
            'FAILED'
          );
          break;
      }
    } catch (error) {
      console.error('Error handling payment event:', error);
      throw error;
    }
  }
} 