import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class BoatService {
  // Get all boats with current prices and owner info
  async getAllBoats() {
    return prisma.boats.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            role: true,
          }
        },
        boatPrices: {
          where: {
            isActive: true,
            effectiveDate: {
              lte: new Date()
            },
            OR: [
              { expiryDate: null },
              { expiryDate: { gt: new Date() } }
            ]
          }
        },
        features: true,
      }
    })
  }

  // Get single boat with details
  async getBoat(id: number) {
    return prisma.boats.findFirst({
      where: {
        id,
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            bio: true,
            membershipTier: true,
            createdAt: true,
            role: true,
            status: true,
          }
        },
        boatPrices: {
          where: {
            isActive: true,
            effectiveDate: {
              lte: new Date()
            },
            OR: [
              { expiryDate: null },
              { expiryDate: { gt: new Date() } }
            ]
          }
        },
        features: true,
      }
    })
  }

  // Get boat availability
  async getBoatAvailability(boatId: number, startDate: string, endDate: string) {
    try {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const conflictingBookings = await prisma.bookings.findMany({
        where: {
          boatId,
          status: "CONFIRMED",
          OR: [
            {
              startDate: {
                gte: parsedStartDate,
                lte: parsedEndDate
              }
            },
            {
              endDate: {
                gte: parsedStartDate,
                lte: parsedEndDate
              }
            }
          ]
        },
        select: {
          startDate: true,
          endDate: true
        }
      });

      return {
        available: conflictingBookings.length === 0,
        conflictingBookings
      };
    } catch (error) {
      console.error('Error in getBoatAvailability:', error);
      throw error;
    }
  }

  // Get boat prices
  async getBoatPrices(boatId: number, date: Date) {
    const prices = await prisma.boatPrices.findMany({
      where: {
        boatId,
        isActive: true,
        effectiveDate: {
          lte: date
        },
        OR: [
          { expiryDate: null },
          { expiryDate: { gt: date } }
        ]
      },
      select: {
        id: true,
        hours: true,
        price: true,
        isActive: true,
        description: true,
        effectiveDate: true,
        expiryDate: true
      },
      orderBy: {
        hours: 'asc'
      }
    });

    return {
      prices: prices.map(price => ({
        ...price,
        price: Number(price.price) // Convert Decimal to number for frontend
      }))
    };
  }

  // Additional methods needed
  async searchBoats(filters: {
    location?: string;
    startDate?: Date;
    endDate?: Date;
    capacity?: number;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    return prisma.boats.findMany({
      where: {
        status: 'ACTIVE',
        ...(filters.location && { location: { contains: filters.location, mode: 'insensitive' } }),
        ...(filters.capacity && { capacity: { gte: filters.capacity } }),
        ...(filters.type && { type: filters.type }),
        // Add price range filtering through boatPrices relation
      },
      include: {
        boatPrices: {
          where: { isActive: true }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })
  }

  async getFeaturedBoats() {
    return prisma.boats.findMany({
      where: {
        status: 'ACTIVE',
        averageRating: {
          gt: 4.0
},
        // Add featured criteria
      },
      take: 6,
      orderBy: {
        averageRating: 'desc'
      }
    })
  }

  async getBoatReviews(boatId: number) {
    return prisma.reviews.findMany({
      where: {
        targetId: boatId,
        status: 'PUBLISHED'
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    })
  }

  async getBoatBookingHistory(boatId: number) {
    return prisma.bookings.findMany({
      where: {
        boatId,
        status: { in: ['CONFIRMED'] }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })
  }

  // Get similar boats
  async getSimilarBoats(boatId: number, limit = 3) {
    const boat = await prisma.boats.findUnique({
      where: { id: boatId },
      select: { type: true, capacity: true, location: true }
    })

    if (!boat) return []

    return prisma.boats.findMany({
      where: {
        id: { not: boatId },
        status: 'ACTIVE',
        OR: [
          { type: boat.type },
          { location: boat.location },
          { capacity: { gte: boat.capacity - 2, lte: boat.capacity + 2 } }
        ]
      },
      take: limit,
      include: {
        boatPrices: {
          where: { isActive: true }
        },
        reviews: {
          where: { status: 'PUBLISHED' }
        }
      }
    })
  }

  // Get popular boats in location
  async getPopularBoatsInLocation(location: string, limit = 6) {
    return prisma.boats.findMany({
      where: {
        status: 'ACTIVE',
        location: { contains: location, mode: 'insensitive' },
        totalBookings: { gt: 0 }
      },
      orderBy: [
        { totalBookings: 'desc' },
        { averageRating: 'desc' }
      ],
      take: limit,
      include: {
        boatPrices: {
          where: { isActive: true }
        }
      }
    })
  }

  // Get last-minute deals
  async getLastMinuteDeals(days = 7) {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    return prisma.boats.findMany({
      where: {
        status: 'ACTIVE',
        boatPrices: {
          some: {
            isActive: true,
            // Add any special pricing logic
          }
        },
        // No bookings in next X days
        bookings: {
          none: {
            startDate: {
              lte: futureDate
            },
            status: 'CONFIRMED'
          }
        }
      },
      include: {
        boatPrices: {
          where: { isActive: true }
        }
      }
    })
  }

  // Get boat statistics
  async getBoatStats(boatId: number) {
    const [bookings, reviews, revenue] = await Promise.all([
      prisma.bookings.count({
        where: {
          boatId,
          status: 'CONFIRMED'
        }
      }),
      prisma.reviews.aggregate({
        where: {
          targetId: boatId,
          status: 'PUBLISHED'
        },
        _avg: {
          rating: true,
          cleanliness: true,
          communication: true,
          accuracy: true
        },
        _count: true
      }),
      prisma.bookings.aggregate({
        where: {
          boatId,
          status: 'CONFIRMED'
        },
        _sum: {
          totalPrice: true
        }
      })
    ])

    return {
      totalBookings: bookings,
      reviews: {
        count: reviews._count,
        averageRating: reviews._avg.rating,
        averageCleanliness: reviews._avg.cleanliness,
        averageCommunication: reviews._avg.communication,
        averageAccuracy: reviews._avg.accuracy
      },
      totalRevenue: revenue._sum.totalPrice
    }
  }

  // Get boat calendar availability
  async getBoatCalendar(boatId: number, startDate: Date, endDate: Date) {
    const bookings = await prisma.bookings.findMany({
      where: {
        boatId,
        status: 'CONFIRMED',
        startDate: { gte: startDate },
        endDate: { lte: endDate }
      },
      select: {
        startDate: true,
        endDate: true
      }
    })

    // Process bookings into calendar format
    return this.processCalendarData(bookings, startDate, endDate)
  }

  private processCalendarData(bookings: any[], startDate: Date, endDate: Date) {
    // Helper method to process calendar data
    // Implementation depends on your frontend calendar needs
    return bookings
  }

  async getPriceRange() {
    const prices = await prisma.boatPrices.aggregate({
      _min: {
        price: true
      },
      _max: {
        price: true
      },
      where: {
        isActive: true
      }
    });

    return {
      min: prices._min.price || 0,
      max: prices._max.price || 10000
    };
  }
} 