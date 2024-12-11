import { Prisma, PrismaClient, UserRole, UserStatus, BoatStatus, BookingStatus } from '@prisma/client'

const prisma = new PrismaClient()

export class AdminService {
    //----------------------------------------------User Management----------------------------------------------//
  
    async getAllUsers(params: {
      page?: number;
      search?: string;
      role?: UserRole;
    }) {
      const { page = 1, search, role } = params;
      const limit = 10;
      const skip = (page - 1) * limit;
  
      const where: Prisma.UsersWhereInput = {};
      
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } }
        ];
      }
  
      if (role) {
        where.role = role;
      }
  
      const [users, total] = await Promise.all([
        prisma.users.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            profileImage: true,
            languagePreference: true,
            timezone: true,
            membershipTier: true,
            loyaltyPoints: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            isProfileComplete: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.users.count({ where })
      ]);
  
      return {
        data: users,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page
        }
      };
    }
  
    async updateUser(id: number, data: Prisma.UsersUpdateInput) {
      // Validate user exists
      const existingUser = await prisma.users.findUnique({
        where: { id }
      });
  
      if (!existingUser) {
        throw new Error('User not found');
      }
  
      // Handle email uniqueness
      if (data.email && data.email !== existingUser.email) {
        const emailExists = await prisma.users.findUnique({
          where: { email: data.email as string }
        });
        if (emailExists) {
          throw new Error('Email already in use');
        }
      }
  
      // Handle phone number uniqueness
      if (data.phoneNumber && data.phoneNumber !== existingUser.phoneNumber) {
        const phoneExists = await prisma.users.findUnique({
          where: { phoneNumber: data.phoneNumber as string }
        });
        if (phoneExists) {
          throw new Error('Phone number already in use');
        }
      }
  
      return prisma.users.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          profileImage: true
        }
      });
    }
  
    async deleteUser(id: number) {
      // Check if user exists
      const user = await prisma.users.findUnique({
        where: { id },
        include: {
          boats: true,
          bookings: true
        }
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Use transaction to ensure data consistency
      return prisma.$transaction(async (tx) => {
        // Cancel active bookings
        await tx.bookings.updateMany({
          where: {
            userId: id,
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        });
  
        // Set boats to inactive
        await tx.boats.updateMany({
          where: {
            ownerId: id,
            status: 'ACTIVE'
          },
          data: {
            status: 'INACTIVE',
            updatedAt: new Date()
          }
        });
  
        // Delete user
        return tx.users.delete({
          where: { id }
        });
      });
    }
  
    async suspendUser(id: number) {
      // Check if user exists
      const user = await prisma.users.findUnique({
        where: { id }
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      // Use transaction to handle related updates
      return prisma.$transaction(async (tx) => {
        // Cancel active bookings
        await tx.bookings.updateMany({
          where: {
            userId: id,
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          },
          data: {
            status: 'CANCELLED',
            updatedAt: new Date()
          }
        });
  
        // Set boats to inactive
        await tx.boats.updateMany({
          where: {
            ownerId: id,
            status: 'ACTIVE'
          },
          data: {
            status: 'INACTIVE',
            updatedAt: new Date()
          }
        });
  
        // Suspend user
        return tx.users.update({
          where: { id },
          data: {
            status: UserStatus.SUSPENDED,
            updatedAt: new Date()
          }
        });
      });
    }
    
    //----------------------------------------------Boat Management----------------------------------------------//

  async getAllBoats(params: {
    page?: number;
    limit?: number;
    status?: BoatStatus;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BoatsWhereInput = {
      status: params.status || undefined,
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { location: { contains: params.search, mode: 'insensitive' } },
          { make: { contains: params.search, mode: 'insensitive' } }
        ]
      })
    };

    const orderBy = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : undefined;

    const [boats, total] = await Promise.all([
      prisma.boats.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          boatPrices: {
            where: {
              isActive: true,
              effectiveDate: { lte: new Date() }
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
      }),
      prisma.boats.count({ where })
    ]);

    return {
      boats,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    };
  }

  async addNewBoat(data: Prisma.BoatsCreateInput) {
    const { boatPrices, features, lastServiced, ...boatData } = data;

    return prisma.boats.create({
      data: {
        ...boatData,
        ...(lastServiced ? { lastServiced: new Date(lastServiced) } : {}),
        year: Number(boatData.year),
        capacity: Number(boatData.capacity),
        features: features && {
          connect: Array.isArray(features) 
            ? features.map(id => ({ id: typeof id === 'number' ? id : Number(id) }))
            : []
        },
        boatPrices: boatPrices && {
          create: Array.isArray(boatPrices) 
            ? boatPrices.map(price => ({
                effectiveDate: new Date(price.effectiveDate),
                expiryDate: price.expiryDate ? new Date(price.expiryDate) : undefined,
                hours: Number(price.hours),
                price: Number(price.price),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              }))
            : []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        boatPrices: true,
        features: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }
  
  async editBoat(id: number, data: Prisma.BoatsUpdateInput) {
    // Extract features and boatPrices from data
    const { features, boatPrices, ...restData } = data;

    return prisma.boats.update({
      where: { id },
      data: {
        ...restData,
        // Properly format features update
        features: features ? {
          set: [], // Clear existing connections
          connect: (features as any[]).map(feature => ({ id: feature.id }))
        } : undefined,
        // Properly format boatPrices update if needed
        boatPrices: boatPrices ? {
          deleteMany: {}, // Optional: remove old prices
          create: (boatPrices as any[]).map(price => ({
            effectiveDate: new Date(price.effectiveDate),
            expiryDate: price.expiryDate ? new Date(price.expiryDate) : undefined,
            hours: Number(price.hours),
            price: Number(price.price),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        } : undefined,
        // Ensure numeric fields are numbers
        capacity: data.capacity ? Number(data.capacity) : undefined,
        year: data.year ? Number(data.year) : undefined,
      },
      include: {
        boatPrices: {
          where: {
            isActive: true
          }
        },
        features: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
  }


  //----------------------------------------------Booking Management----------------------------------------------//
  
  async getAllBookings(params: {
    page?: number;
    search?: string;
    status?: BookingStatus;
    startDate?: string;
    endDate?: string;
  } = {}) {
    const { page = 1, search, status, startDate, endDate } = params;
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingsWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          user: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        },
        {
          boat: {
            name: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate)
      };
    }

    if (endDate) {
      where.endDate = {
        lte: new Date(endDate)
      };
    }

    const [bookings, total] = await Promise.all([
      prisma.bookings.findMany({
        where,
        skip,
        take: limit,
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
          boat: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.bookings.count({ where })
    ]);

    return {
      bookings,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    };
  }

  async updateBooking(id: number, data: Prisma.BookingsUpdateInput) {
    return prisma.bookings.update({
      where: { id },
      data
    })
  }

  async deleteBooking(id: number) {
    return prisma.bookings.delete({
      where: { id }
    })
  }

  //----------------------------------------------Feature Management----------------------------------------------//
  
  async getAllFeatures() {
    return prisma.boatFeature.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })
  }

  async addFeature(data: Prisma.BoatFeatureCreateInput) {
    return prisma.boatFeature.create({
      data
    })
  }

  async updateFeature(id: number, data: Prisma.BoatFeatureUpdateInput) {
    return prisma.boatFeature.update({
      where: { id },
      data
    })
  }

  async deleteFeature(id: number) {
    return prisma.boatFeature.delete({
      where: { id }
    })
  }

  //----------------------------------------------Boat History----------------------------------------------//
  
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

  //----------------------------------------------Statistics and Analytics----------------------------------------------//
  
  async getBoatStatistics() {
    // Implementation for boat statistics
    return prisma.boats.findMany({
      select: {
        id: true,
        name: true,
        totalBookings: true,
        averageRating: true,
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      }
    })
  }

  async getBookingRevenue(startDate: Date, endDate: Date) {
    return prisma.bookings.findMany({
      where: {
        startDate: {
          gte: startDate
        },
        endDate: {
          lte: endDate
        },
        status: BookingStatus.COMPLETED
      },
      select: {
        totalPrice: true,
        boat: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })
  }

  async getBookingById(id: number | undefined) {
    if (!id) {
      throw new Error('Booking ID is required');
    }

    return prisma.bookings.findUnique({
      where: { 
        id: id
      },
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
          include: {
            boatPrices: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
  }

  async getUserBookings(userId: number) {
    return prisma.bookings.findMany({
      where: { userId },
      include: {
        boat: true,
        boatPrice: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async createBooking(data: Prisma.BookingsUncheckedCreateInput) {
    return prisma.bookings.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        boat: true,
        boatPrice: true,
        user: true
      }
    });
  }

  async updateBookingStatus(id: number, status: BookingStatus, note?: string) {
    const booking = await prisma.bookings.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        ...(note && {
          notes: {
            push: {
              content: note,
              timestamp: new Date()
            }
          }
        })
      }
    });

    // Send notification based on status change
    await this.sendBookingStatusNotification(booking);
    
    return booking;
  }

  async bulkUpdateBookings(bookingIds: number[], data: Partial<Prisma.BookingsUpdateInput>) {
    return prisma.$transaction(
      bookingIds.map(id => 
        prisma.bookings.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date()
          }
        })
      )
    );
  }

  async getBookingHistory(id: number) {
    return prisma.bookings.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        boat: true,
        // Include any history or audit logs if you have them
      }
    });
  }

  async addBookingNote(id: number, note: string, adminId: number) {
    return prisma.bookings.update({
      where: { id },
      data: {
        notes: {
          push: {
            content: note,
            adminId,
            timestamp: new Date()
          }
        },
        updatedAt: new Date()
      }
    });
  }

  async getUpcomingBookings(days: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.bookings.findMany({
      where: {
        startDate: {
          gte: new Date(),
          lte: futureDate
        },
        status: 'CONFIRMED'
      },
      include: {
        boat: true,
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
        startDate: 'asc'
      }
    });
  }

  async getCanceledBookings(startDate?: Date, endDate?: Date) {
    return prisma.bookings.findMany({
      where: {
        status: 'CANCELLED',
        ...(startDate && endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        })
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        boat: true
      }
    });
  }

  async reassignBooking(bookingId: number, newBoatId: number) {
    // First check if new boat is available
    const booking = await prisma.bookings.findUnique({
      where: { id: bookingId }
    });

    if (!booking) throw new Error('Booking not found');

    const conflictingBookings = await prisma.bookings.findMany({
      where: {
        boatId: newBoatId,
        status: 'CONFIRMED',
        OR: [
          {
            startDate: {
              lte: booking.endDate,
              gte: booking.startDate
            }
          },
          {
            endDate: {
              lte: booking.endDate,
              gte: booking.startDate
            }
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      throw new Error('New boat is not available for these dates');
    }

    return prisma.bookings.update({
      where: { id: bookingId },
      data: {
        boatId: newBoatId,
        updatedAt: new Date()
      },
      include: {
        boat: true,
        user: true
      }
    });
  }

  async getBookingAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const [totalBookings, recentBookings, canceledBookings, revenue] = await Promise.all([
      prisma.bookings.count(),
      prisma.bookings.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      prisma.bookings.count({
        where: {
          status: 'CANCELLED'
        }
      }),
      prisma.bookings.aggregate({
        where: {
          status: 'COMPLETED'
        },
        _sum: {
          totalPrice: true
        }
      })
    ]);

    return {
      totalBookings,
      recentBookings,
      canceledBookings,
      totalRevenue: revenue._sum.totalPrice || 0,
      cancellationRate: (canceledBookings / totalBookings) * 100
    };
  }

  async generateBookingReport(startDate: Date, endDate: Date, format: 'json' | 'csv' | 'pdf' = 'json') {
    const bookings = await prisma.bookings.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        boat: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (format === 'json') {
      return bookings;
    }

    // Handle other formats (you'll need to implement these)
    if (format === 'csv') {
      return this.generateCSVReport(bookings);
    }

    if (format === 'pdf') {
      return this.generatePDFReport(bookings);
    }
  }

  private async sendBookingStatusNotification(booking: any) {
    // Implement notification logic here
    // This could send emails, SMS, or in-app notifications
  }

  private generateCSVReport(bookings: any[]) {
    // Implement CSV generation
  }

  private generatePDFReport(bookings: any[]) {
    // Implement PDF generation
  }
} 