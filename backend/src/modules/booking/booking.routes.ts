import { Router, RequestHandler } from 'express';
import { BookingController } from './booking.controller.js';
import { authenticate, isAdmin } from '../auth/auth.middleware.js';

const router = Router();
const bookingController = new BookingController();

// Protected routes - User
router.get('/my-bookings', authenticate as RequestHandler, bookingController.getUserBookings.bind(bookingController));
router.post('/:id/cancel', authenticate as RequestHandler, bookingController.cancelBooking.bind(bookingController));

// Protected routes - Admin
router.put('/status/:id', authenticate as RequestHandler, isAdmin as RequestHandler, bookingController.updateBookingStatus.bind(bookingController));

export default router; 