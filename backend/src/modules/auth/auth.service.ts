import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import smsService from '../../services/sms.service.js'

const prisma = new PrismaClient()

export class AuthService {
  private formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '')
    return `+${cleaned}`
  }

  async loginWithPhone(phoneNumber: string) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber)
    
    const user = await prisma.users.findUnique({
      where: { phoneNumber: formattedPhone }
    })

    if (!user) {
      throw new Error('No account found with this phone number')
    }

    await smsService.sendVerificationCode(formattedPhone)
    return { message: 'Verification code sent' }
  }

  async verifyLoginCode(phoneNumber: string, code: string) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber)
    
    const isValid = await smsService.verifyCode(formattedPhone, code)
    if (!isValid) {
      throw new Error('Invalid verification code')
    }

    const user = await prisma.users.findUnique({
      where: { phoneNumber: formattedPhone }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' }
    )

    return { token: accessToken, refreshToken, user }
  }

  async sendVerificationCode(phoneNumber: string) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber)
    
    const existingUser = await prisma.users.findUnique({
      where: { phoneNumber: formattedPhone }
    })

    if (existingUser?.isProfileComplete) {
      throw new Error('Phone number already registered')
    }

    await smsService.sendVerificationCode(formattedPhone)
    return { message: 'Verification code sent' }
  }

  async verifyCode(phoneNumber: string, code: string) {
    const formattedPhone = this.formatPhoneNumber(phoneNumber)
    
    const isValid = await smsService.verifyCode(formattedPhone, code)
    if (!isValid) {
      throw new Error('Invalid verification code')
    }

    const user = await prisma.users.upsert({
      where: { phoneNumber: formattedPhone },
      update: { isPhoneVerified: true },
      create: {
        phoneNumber: formattedPhone,
        isPhoneVerified: true,
        role: UserRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: '',  // Required fields with defaults
        lastName: '',
        status: 'ACTIVE'
      }
    })

    const tempToken = jwt.sign(
      {
        id: user.id,
        phoneNumber: formattedPhone,
        type: 'registration',
        isPhoneVerified: true
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    return { tempToken }
  }

  async completeProfile(userId: number, profileData: {
    firstName: string
    lastName: string
    email: string
    password: string
    dateOfBirth: Date
    address: string
  }) {
    const hashedPassword = await bcrypt.hash(profileData.password, 10)

    const user = await prisma.users.update({
      where: { id: userId },
      data: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        password: hashedPassword,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        isProfileComplete: true,
        updatedAt: new Date()
      }
    })

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '30d' }
    )

    return { token: accessToken, refreshToken, user }
  }

  async refreshToken(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: number }
    const user = await prisma.users.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    )

    return { token: newAccessToken }
  }

  async getMe(userId: number) {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
} 