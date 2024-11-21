import { Request, Response, NextFunction } from 'express'
import { PrismaClient, Users } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Extend Express Request type to include user
declare module 'express' {
  interface Request {
    user?: Users
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number }
    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const authenticateRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      id: number
      type: string
      isPhoneVerified: boolean
      phoneNumber: string
    }

    if (decoded.type !== 'registration' || !decoded.isPhoneVerified) {
      return res.status(401).json({ message: 'Invalid token type' })
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    })

    if (!user || user.phoneNumber !== decoded.phoneNumber) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Registration authentication error:', error)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    next()
  } catch (error) {
    console.error('Admin check error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const requireCompleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  if (!req.user.isProfileComplete) {
    return res.status(403).json({ message: 'Profile completion required' })
  }

  next()
} 