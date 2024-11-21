import { Router, RequestHandler } from 'express'
import { BoatController } from './boat.controller.js'
import { authenticate, isAdmin } from '../auth/auth.middleware.js'

const router = Router()
const boatController = new BoatController()

// Bind all methods
const getAllBoats: RequestHandler = boatController.getAllBoats.bind(boatController)
const searchBoats: RequestHandler = boatController.searchBoats.bind(boatController)
const getFeaturedBoats: RequestHandler = boatController.getFeaturedBoats.bind(boatController)
const getBoat: RequestHandler = boatController.getBoat.bind(boatController)
const getAvailability: RequestHandler = boatController.getBoatAvailability.bind(boatController)
const getPrices: RequestHandler = boatController.getBoatPrices.bind(boatController)
const getBoatReviews: RequestHandler = boatController.getBoatReviews.bind(boatController)
const getBookingHistory: RequestHandler = boatController.getBoatBookingHistory.bind(boatController)
const getSimilarBoats: RequestHandler = boatController.getSimilarBoats.bind(boatController)
const getPopularBoats: RequestHandler = boatController.getPopularBoatsInLocation.bind(boatController)
const getLastMinuteDeals: RequestHandler = boatController.getLastMinuteDeals.bind(boatController)
const getBoatStats: RequestHandler = boatController.getBoatStats.bind(boatController)
const getBoatCalendar: RequestHandler = boatController.getBoatCalendar.bind(boatController)

// Public routes
router.get('/', getAllBoats)
router.get('/search', searchBoats)
router.get('/featured', getFeaturedBoats)
router.get('/popular', getPopularBoats)
router.get('/deals', getLastMinuteDeals)

// Individual boat routes with numeric ID validation
router.get('/:id([0-9]+)', getBoat)
router.get('/:id([0-9]+)/availability', getAvailability)
router.get('/:id([0-9]+)/prices', getPrices)
router.get('/:id([0-9]+)/reviews', getBoatReviews)
router.get('/:id([0-9]+)/history', authenticate as RequestHandler, getBookingHistory)
router.get('/:id([0-9]+)/similar', getSimilarBoats)
router.get('/:id([0-9]+)/stats', authenticate as RequestHandler, isAdmin as RequestHandler, getBoatStats)
router.get('/:id([0-9]+)/calendar', getBoatCalendar)

export default router 