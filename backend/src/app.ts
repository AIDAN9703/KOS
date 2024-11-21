import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { createServer } from 'node:http'
import socketService from './services/socket.service.js'

// Import routes
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/users/user.routes.js'
import bookingRoutes from './modules/booking/booking.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import boatRoutes from './modules/boats/boat.routes.js'

const app = express()
const httpServer = createServer(app)

// Initialize socket.io
socketService.init(httpServer)

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}))

// Special handling for Stripe webhooks
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

// Standard middleware
app.use(express.json())

// Basic request logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
  })
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/boats', boatRoutes)

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  })
})

// Start server
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app 