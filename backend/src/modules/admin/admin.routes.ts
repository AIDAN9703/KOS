import { Router, RequestHandler } from 'express'
import { AdminController } from './admin.controller.js'
import { authenticate, isAdmin } from '../auth/auth.middleware.js'
import { BoatController } from '../boats/boat.controller.js'
import { errorHandler } from '@/middleware/errorHandler.js'
const router = Router()
const adminController = new AdminController()

// Bind controller methods
const getAllBoats: RequestHandler = adminController.getAllBoats.bind(adminController)
const addNewBoat: RequestHandler = adminController.addNewBoat.bind(adminController)
const editBoat: RequestHandler = adminController.editBoat.bind(adminController)
const getAllUsers: RequestHandler = adminController.getAllUsers.bind(adminController)
const updateUser: RequestHandler = adminController.updateUser.bind(adminController)
const suspendUser: RequestHandler = adminController.suspendUser.bind(adminController)
const getAllBookings: RequestHandler = adminController.getAllBookings.bind(adminController)
const getBoatStatistics: RequestHandler = adminController.getBoatStatistics.bind(adminController)
const getBookingRevenue: RequestHandler = adminController.getBookingRevenue.bind(adminController)
const deleteBoat: RequestHandler = adminController.deleteBoat.bind(adminController)
const updateBooking: RequestHandler = adminController.updateBooking.bind(adminController)
const deleteBooking: RequestHandler = adminController.deleteBooking.bind(adminController)
const deleteUser: RequestHandler = adminController.deleteUser.bind(adminController)
const getBoatBookingHistory: RequestHandler = adminController.getBoatBookingHistory.bind(adminController)
const deleteFeature: RequestHandler = adminController.deleteFeature.bind(adminController)
const updateFeature: RequestHandler = adminController.updateFeature.bind(adminController)
const getBoatHistory: RequestHandler = adminController.getBoatBookingHistory.bind(adminController)
const getAllFeatures: RequestHandler = adminController.getAllFeatures.bind(adminController)
const addFeature: RequestHandler = adminController.addFeature.bind(adminController)
const getBookingById: RequestHandler = adminController.getBookingById.bind(adminController)
const getUserBookings: RequestHandler = adminController.getUserBookings.bind(adminController)
const createBooking: RequestHandler = adminController.createBooking.bind(adminController)
const updateBookingStatus: RequestHandler = adminController.updateBookingStatus.bind(adminController)
const getBookingAnalytics: RequestHandler = adminController.getBookingAnalytics.bind(adminController)
const bulkUpdateBookings: RequestHandler = adminController.bulkUpdateBookings.bind(adminController)
const getBookingHistory: RequestHandler = adminController.getBookingHistory.bind(adminController)
const addBookingNote: RequestHandler = adminController.addBookingNote.bind(adminController)
const getUpcomingBookings: RequestHandler = adminController.getUpcomingBookings.bind(adminController)
const getCanceledBookings: RequestHandler = adminController.getCanceledBookings.bind(adminController)
const reassignBooking: RequestHandler = adminController.reassignBooking.bind(adminController)
const generateBookingReport: RequestHandler = adminController.generateBookingReport.bind(adminController)

// Apply admin middleware to all routes
router.use(errorHandler)
router.use(authenticate as RequestHandler, isAdmin as RequestHandler)

// Boat Management
router.get('/boats', getAllBoats)
router.post('/boats', addNewBoat)
router.put('/boats/:id', editBoat)
router.delete('/boats/:id', deleteBoat)
router.get('/boats/:id/history', getBoatHistory)

// User Management
router.get('/users', getAllUsers)
router.put('/users/:id', updateUser)
router.put('/users/:id/suspend', suspendUser)
router.delete('/users/:id', deleteUser)

// Booking Management
// 1. Static routes first
router.get('/bookings/analytics', getBookingAnalytics)
router.get('/bookings/upcoming', getUpcomingBookings)
router.get('/bookings/canceled', getCanceledBookings)
router.get('/bookings/reports', generateBookingReport)
router.post('/bookings/bulk-update', bulkUpdateBookings)
router.get('/bookings/user/:userId', getUserBookings)

// 2. Main bookings route
router.get('/bookings', getAllBookings)

// 3. ID-based routes last
router.get('/bookings/:id', getBookingById)
router.get('/bookings/:id/history', getBookingHistory)
router.put('/bookings/:id/status', updateBookingStatus)
router.post('/bookings/:id/notes', addBookingNote)
router.put('/bookings/:id/reassign', reassignBooking)

// Advanced booking management
router.get('/bookings/user/:userId', getUserBookings)
router.put('/bookings/:id/status', updateBookingStatus)
router.post('/bookings/bulk-update', bulkUpdateBookings)
router.get('/bookings/:id/history', getBookingHistory)
router.post('/bookings/:id/notes', addBookingNote)
router.get('/bookings/upcoming', getUpcomingBookings)
router.get('/bookings/canceled', getCanceledBookings)
router.put('/bookings/:id/reassign', reassignBooking)

// Analytics and Reports
router.get('/statistics/boats', getBoatStatistics)
router.get('/statistics/revenue', getBookingRevenue)
router.delete('/features/:id', deleteFeature)
router.put('/features/:id', updateFeature)
router.get('/features', getAllFeatures)
router.post('/features', addFeature)

export default router 