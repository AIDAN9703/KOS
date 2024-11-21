import { PrismaClient, UserRole, UserStatus, BoatStatus, BookingStatus, PaymentStatus } from '@prisma/client'

const prisma = new PrismaClient()

export class AdminService {
  // Boat Management
  async getAllBoats() {
    return prisma.boats.findMany({
      where: {
        status: BoatStatus.ACTIVE
      },
      include: {
        boatPrices: {
          where: {
            isActive: true,
            effectiveDate: {
              lte: new Date()
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
  }

  async addNewBoat(data: {
    name: string
    type: string
    length: string
    capacity: number
    location: string
    description: string
    images: string[]
    make: string
    model: string
    year: number
    ownerId: number
    prices?: Array<{
      hours: number
      price: number
      effectiveDate: string
      expiryDate: string
      isActive: boolean
    }>
  }) {
    return prisma.boats.create({
      data: {
        name: data.name,
        type: data.type,
        length: data.length,
        capacity: data.capacity,
        location: data.location,
        description: data.description,
        images: data.images,
        make: data.make,
        model: data.model,
        year: data.year,
        status: BoatStatus.ACTIVE,
        ownerId: data.ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        boatPrices: data.prices ? {
          create: data.prices.map(price => ({
            ...price,
            effectiveDate: new Date(price.effectiveDate),
            expiryDate: new Date(price.expiryDate),
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        } : undefined
      },
      include: {
        boatPrices: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
  }

  // User Management
  async getAllUsers() {
    return prisma.users.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        status: true
      }
    })
  }

  async updateUser(id: number, data: {
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    role?: UserRole
  }) {
    return prisma.users.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }

  async suspendUser(id: number) {
    return prisma.users.update({
      where: { id },
      data: {
        status: UserStatus.SUSPENDED,
        updatedAt: new Date()
      }
    })
  }

  // Booking Management
  async getAllBookings() {
    return prisma.bookings.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true
          }
        },
        boat: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // Analytics
  async getBoatStatistics() {
    const [boats, totalBookings, activeBoats] = await Promise.all([
      prisma.boats.groupBy({
        by: ['status'],
        _count: {
          id: true
        },
        _avg: {
          capacity: true
        }
      }),
      prisma.bookings.count(),
      prisma.boats.count({
        where: { status: BoatStatus.ACTIVE }
      })
    ])

    return {
      boatStats: boats,
      totalBookings,
      activeBoats
    }
  }

  async getBookingRevenue(startDate: Date, endDate: Date) {
    return prisma.$queryRaw`
      SELECT 
        date_trunc('month', "createdAt") as month,
        SUM("totalPrice") as revenue,
        COUNT(*) as bookingCount
      FROM "Bookings"
      WHERE 
        status = ${BookingStatus.COMPLETED}
        AND "createdAt" BETWEEN ${startDate} AND ${endDate}
      GROUP BY date_trunc('month', "createdAt")
      ORDER BY month DESC
    `
  }

  async editBoat(id: number, data: {
    name?: string
    type?: string
    length?: string
    capacity?: number
    location?: string
    description?: string
    images?: string[]
    make?: string
    model?: string
    year?: number
    prices?: Array<{
      id?: number
      hours: number
      price: number
      effectiveDate: Date
      expiryDate?: Date
    }>
  }) {
    // First update the boat details
    const boat = await prisma.boats.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })

    // Handle price updates if provided
    if (data.prices) {
      // Get existing prices
      const existingPrices = await prisma.boatPrices.findMany({
        where: { boatId: id }
      })

      // Create a map of existing prices for easy lookup
      const existingPriceMap = new Map(
        existingPrices.map(price => [
          `${price.effectiveDate}-${price.expiryDate}-${price.hours}`,
          price
        ])
      )

      // Process each price
      for (const price of data.prices) {
        const priceKey = `${price.effectiveDate}-${price.expiryDate}-${price.hours}`
        const existingPrice = existingPriceMap.get(priceKey)

        if (existingPrice) {
          // Update existing price
          await prisma.boatPrices.update({
            where: { id: existingPrice.id },
            data: {
              price: price.price,
              isActive: true,
              updatedAt: new Date()
            }
          })
          existingPriceMap.delete(priceKey)
        } else {
          // Create new price
          await prisma.boatPrices.create({
            data: {
              boatId: id,
              hours: price.hours,
              price: price.price,
              effectiveDate: price.effectiveDate,
              expiryDate: price.expiryDate,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          })
        }
      }

      // Deactivate remaining old prices instead of deleting them
      for (const [_, oldPrice] of existingPriceMap) {
        await prisma.boatPrices.update({
          where: { id: oldPrice.id },
          data: {
            isActive: false,
            updatedAt: new Date()
          }
        })
      }
    }

    // Return updated boat with all associations
    return prisma.boats.findUnique({
      where: { id },
      include: {
        boatPrices: {
          where: { isActive: true }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
  }

  // Feature Management
  async getAllFeatures() {
    return prisma.boatFeature.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })
  }

  async addFeature(data: {
    name: string
    category: string
    icon?: string
  }) {
    return prisma.boatFeature.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  async updateFeature(id: number, data: {
    name?: string
    category?: string
    icon?: string
  }) {
    return prisma.boatFeature.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }

  async deleteFeature(id: number) {
    return prisma.boatFeature.delete({
      where: { id }
    })
  }

  // Booking Management
  async updateBooking(id: number, data: {
    status?: BookingStatus
    startDate?: Date
    endDate?: Date
    totalPrice?: number
  }) {
    return prisma.bookings.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }

  async deleteBooking(id: number) {
    return prisma.bookings.delete({
      where: { id }
    })
  }

  // User Management
  async deleteUser(id: number) {
    return prisma.users.delete({
      where: { id }
    })
  }

  // Boat History
  async getBoatBookingHistory(boatId: number) {
    return prisma.bookings.findMany({
      where: { boatId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
} 