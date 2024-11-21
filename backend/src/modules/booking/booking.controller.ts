import { Request, Response } from 'express';
import { BookingService } from './booking.service.js';
import { BookingStatus, PaymentStatus } from '@prisma/client';

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
        boatPriceId 
      } = req.body;

      const booking = await this.bookingService.createBooking({
        userId: req.user.id,
        boatId,
        boatPriceId,
        startDate: new Date(startDate),
        endDate: new Date(new Date(startDate).getTime() + duration * 60 * 60 * 1000),
        duration,
        totalPrice,
        specialRequests,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(500).json({ error: 'Failed to create booking' });
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