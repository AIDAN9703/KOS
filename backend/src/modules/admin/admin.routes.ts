import { Router, RequestHandler } from 'express'
import { AdminController } from './admin.controller.js'
import { authenticate, isAdmin } from '../auth/auth.middleware.js'
import { BoatController } from '../boats/boat.controller.js'
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
// Apply admin middleware to all routes
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
router.get('/bookings', getAllBookings)
router.put('/bookings/:id', updateBooking)
router.delete('/bookings/:id', deleteBooking)

// Analytics and Reports
router.get('/statistics/boats', getBoatStatistics)
router.get('/statistics/revenue', getBookingRevenue)
router.delete('/features/:id', deleteFeature)
router.put('/features/:id', updateFeature)

export default router 