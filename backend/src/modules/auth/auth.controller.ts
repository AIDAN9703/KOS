import { Request, Response } from 'express'
import { AuthService } from './auth.service.js'

const authService = new AuthService()

interface CompleteProfileBody {
  firstName: string
  lastName: string
  email?: string
  password: string
  dateOfBirth: string
  address?: string
  phoneNumber: string
  role?: 'USER' | 'ADMIN' | 'OWNER'
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export class AuthController {
  async loginWithPhone(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body

      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' })
      }

      const result = await authService.loginWithPhone(phoneNumber)
      res.json(result)
    } catch (error) {
      console.error('Login initiation error:', error)
      if (error instanceof Error) {
        res.status(404).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to send verification code' })
      }
    }
  }

  async verifyLoginCode(req: Request, res: Response) {
    try {
      const { phoneNumber, code } = req.body

      if (!phoneNumber || !code) {
        return res.status(400).json({ error: 'Phone number and code are required' })
      }

      const result = await authService.verifyLoginCode(phoneNumber, code)
      res.json(result)
    } catch (error) {
      console.error('Login verification error:', error)
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to verify code' })
      }
    }
  }

  async sendVerificationCode(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body

      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' })
      }

      const result = await authService.sendVerificationCode(phoneNumber)
      res.json(result)
    } catch (error) {
      console.error('Phone verification error:', error)
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to send verification code' })
      }
    }
  }

  async verifyCode(req: Request, res: Response) {
    try {
      const { phoneNumber, code } = req.body

      if (!phoneNumber || !code) {
        return res.status(400).json({ error: 'Phone number and code are required' })
      }

      const result = await authService.verifyCode(phoneNumber, code)
      res.json(result)
    } catch (error) {
      console.error('Code verification error:', error)
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to verify code' })
      }
    }
  }

  async completeProfile(req: Request, res: Response) {
    try {
      const profileData = req.body as CompleteProfileBody
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'password', 'dateOfBirth', 'phoneNumber']
      const missingFields = requiredFields.filter(field => !profileData[field as keyof CompleteProfileBody])

      if (missingFields.length > 0) {
        return res.status(400).json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        })
      }

      const result = await authService.completeProfile(userId, {
        ...profileData,
        dateOfBirth: new Date(profileData.dateOfBirth)
      })

      res.json(result)
    } catch (error) {
      console.error('Profile completion error:', error)
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to complete profile' })
      }
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const user = await authService.getMe(userId)
      res.json(user)
    } catch (error) {
      console.error('Get user error:', error)
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Failed to fetch user data' })
      }
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' })
      }

      const result = await authService.refreshToken(refreshToken)
      res.json(result)
    } catch (error) {
      console.error('Token refresh error:', error)
      res.status(401).json({ error: 'Invalid refresh token' })
    }
  }
} 