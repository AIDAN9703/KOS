import { Router, RequestHandler } from 'express';
import { BookingController } from './booking.controller.js';
import { authenticate, isAdmin } from '../auth/auth.middleware.js';

const router = Router();
const bookingController = new BookingController();

// Public routes (none currently)

// Protected routes - User
router.post('/', authenticate as RequestHandler, bookingController.createBooking.bind(bookingController));
router.get('/my-bookings', authenticate as RequestHandler, bookingController.getUserBookings.bind(bookingController));
router.post('/:id/cancel', authenticate as RequestHandler, bookingController.cancelBooking.bind(bookingController));

// Protected routes - Admin
router.put('/:id/status', authenticate as RequestHandler, isAdmin as RequestHandler, bookingController.updateBookingStatus.bind(bookingController));

export default router; 