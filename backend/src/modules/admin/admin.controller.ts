import { Request, Response } from 'express'
import { AdminService } from './admin.service.js'
import { Prisma, UserRole, BookingStatus } from '@prisma/client'
import { z } from 'zod';

const adminService = new AdminService()

const boatQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? Number(val) : 1),
  limit: z.string().optional().transform(val => val ? Number(val) : 10),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

const bookingQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? Number(val) : 1),
  search: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export class AdminController {
  //----------------------------------------------Boat Management----------------------------------------------//

  async getAllBoats(req: Request, res: Response) {
    try {
      const query = boatQuerySchema.parse(req.query);
      const result = await adminService.getAllBoats(query);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
      }
      console.error('Error fetching boats:', error);
      res.status(500).json({ error: 'Failed to fetch boats' });
    }
  }

  async addNewBoat(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' })
      }

      const createData = {
        ...req.body,
        user: {
          connect: { id: req.user.id }
        }
      };

      const boat = await adminService.addNewBoat(createData);
      res.status(201).json(boat);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'A boat with this name already exists' })
        }
      }
      console.error('Error creating boat:', error);
      res.status(500).json({ error: 'Failed to create boat' });
    }
  }

  async editBoat(req: Request, res: Response) {
    try {
      const { id } = req.params
      const boatData: Prisma.BoatsUpdateInput = {
        ...req.body,
        updatedAt: new Date()
      }

      // Handle features update if present
      if (req.body.features?.length) {
        boatData.features = {
          set: [], // Clear existing connections
          connect: req.body.features.map((featureId: number) => ({ id: featureId }))
        }
      }

      const boat = await adminService.editBoat(Number(id), boatData)
      res.json(boat)
    } catch (error) {
      console.error('Error updating boat:', error)
      res.status(500).json({ error: 'Failed to update boat' })
    }
  }

  async deleteBoat(req: Request, res: Response) {
    // ... implementation
  }

  //----------------------------------------------User Management----------------------------------------------//

  async getAllUsers(req: Request, res: Response) {
    try {
      const { page, search, role } = req.query;
      const users = await adminService.getAllUsers({
        page: page ? Number(page) : undefined,
        search: search as string,
        role: role ? (role as UserRole) : undefined
      });
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { firstName, lastName, email, phoneNumber, role } = req.body

      const user = await adminService.updateUser(Number(id), {
        firstName,
        lastName,
        email,
        phoneNumber,
        role
      })

      res.json(user)
    } catch (error) {
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  }

  async suspendUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      await adminService.suspendUser(Number(id))
      res.json({ message: 'User suspended successfully' })
    } catch (error) {
      console.error('Error suspending user:', error)
      res.status(500).json({ error: 'Failed to suspend user' })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      await adminService.deleteUser(Number(id))
      res.json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ error: 'Failed to delete user' })
    }
  }

  //----------------------------------------------Booking Management----------------------------------------------//  

  async getAllBookings(req: Request, res: Response) {
    try {
      const query = bookingQuerySchema.parse(req.query);
      const bookings = await adminService.getAllBookings(query);
      res.json(bookings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid query parameters', 
          details: error.errors 
        });
      }
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      const booking = await adminService.updateBooking(Number(id), data);
      res.json(booking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params
      await adminService.deleteBooking(Number(id))
      res.json({ message: 'Booking deleted successfully' })
    } catch (error) {
      console.error('Error deleting booking:', error)
      res.status(500).json({ error: 'Failed to delete booking' })
    }
  }


  async getBookingRevenue(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query
      const revenue = await adminService.getBookingRevenue(
        new Date(startDate as string),
        new Date(endDate as string)
      )
      res.json(revenue)
    } catch (error) {
      console.error('Error fetching revenue:', error)
      res.status(500).json({ error: 'Failed to fetch revenue data' })
    }
  }

  async getBoatBookingHistory(req: Request, res: Response) {
    try {
      const { id } = req.params
      const history = await adminService.getBoatBookingHistory(Number(id))
      res.json(history)
    } catch (error) {
      console.error('Error fetching boat history:', error)
      res.status(500).json({ error: 'Failed to fetch history' })
    }
  }

  //----------------------------------------------Feature Management----------------------------------------------//  

  async deleteFeature(req: Request, res: Response) {
    try {
      const { id } = req.params
      await adminService.deleteFeature(Number(id))
      res.json({ message: 'Feature deleted successfully' })
    } catch (error) {
      console.error('Error deleting feature:', error)
      res.status(500).json({ error: 'Failed to delete feature' })
    }
  }

  async updateFeature(req: Request, res: Response) {
    try {
      const { id } = req.params
      const featureData: Prisma.BoatFeatureUpdateInput = {
        ...req.body,
        updatedAt: new Date()
      }
      const feature = await adminService.updateFeature(Number(id), featureData)
      res.json(feature)
    } catch (error) {
      console.error('Error updating feature:', error)
      res.status(500).json({ error: 'Failed to update feature' })
    }
  }

  async getAllFeatures(req: Request, res: Response) {
    try {
      const features = await adminService.getAllFeatures()
      res.json(features)
    } catch (error) {
      console.error('Error fetching features:', error)
      res.status(500).json({ error: 'Failed to fetch features' })
    }
  }

  async addFeature(req: Request, res: Response) {
    try {
      const featureData: Prisma.BoatFeatureCreateInput = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const feature = await adminService.addFeature(featureData)
      res.status(201).json(feature)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return res.status(400).json({ error: 'A feature with this name already exists' })
        }
      }
      console.error('Error creating feature:', error)
      res.status(500).json({ error: 'Failed to create feature' })
    }
  }

  //-------------------------------------------------Analytics---------------------------------------------------//

  async getBoatStatistics(req: Request, res: Response) {
    try {
      const stats = await adminService.getBoatStatistics()
      res.json(stats)
    } catch (error) {
      console.error('Error fetching boat statistics:', error)
      res.status(500).json({ error: 'Failed to fetch statistics' })
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'Booking ID is required' });
      }

      const booking = await adminService.getBookingById(Number(id));
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      if (error instanceof Error && error.message === 'Booking ID is required') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  }

  async getUserBookings(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const bookings = await adminService.getUserBookings(Number(userId));
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      res.status(500).json({ error: 'Failed to fetch user bookings' });
    }
  }

  async createBooking(req: Request, res: Response) {
    try {
      const bookingData = req.body;
      const booking = await adminService.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      
      if (!Object.values(BookingStatus).includes(status)) {
        return res.status(400).json({ error: 'Invalid booking status' });
      }
      
      const booking = await adminService.updateBookingStatus(Number(id), status, note);
      res.json(booking);
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Failed to update booking status' });
    }
  }

  async bulkUpdateBookings(req: Request, res: Response) {
    try {
      const { bookingIds, data } = req.body;
      
      if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
        return res.status(400).json({ error: 'Invalid booking IDs' });
      }
      
      const updatedBookings = await adminService.bulkUpdateBookings(bookingIds, data);
      res.json(updatedBookings);
    } catch (error) {
      console.error('Error updating bookings:', error);
      res.status(500).json({ error: 'Failed to update bookings' });
    }
  }

  async getBookingHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const history = await adminService.getBookingHistory(Number(id));
      
      if (!history) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json(history);
    } catch (error) {
      console.error('Error fetching booking history:', error);
      res.status(500).json({ error: 'Failed to fetch booking history' });
    }
  }

  async addBookingNote(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { note } = req.body;
      const adminId = req.user?.id;

      if (!note) {
        return res.status(400).json({ error: 'Note content is required' });
      }

      const booking = await adminService.addBookingNote(Number(id), note, adminId);
      res.json(booking);
    } catch (error) {
      console.error('Error adding booking note:', error);
      res.status(500).json({ error: 'Failed to add booking note' });
    }
  }

  async getUpcomingBookings(req: Request, res: Response) {
    try {
      const { days } = req.query;
      const bookings = await adminService.getUpcomingBookings(Number(days) || 7);
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      res.status(500).json({ error: 'Failed to fetch upcoming bookings' });
    }
  }

  async getCanceledBookings(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const bookings = await adminService.getCanceledBookings(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching canceled bookings:', error);
      res.status(500).json({ error: 'Failed to fetch canceled bookings' });
    }
  }

  async reassignBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newBoatId } = req.body;

      if (!newBoatId) {
        return res.status(400).json({ error: 'New boat ID is required' });
      }

      const booking = await adminService.reassignBooking(Number(id), Number(newBoatId));
      res.json(booking);
    } catch (error) {
      console.error('Error reassigning booking:', error);
      res.status(500).json({ 
        error: 'Failed to reassign booking',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getBookingAnalytics(req: Request, res: Response) {
    try {
      const analytics = await adminService.getBookingAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching booking analytics:', error);
      res.status(500).json({ error: 'Failed to fetch booking analytics' });
    }
  }

  async generateBookingReport(req: Request, res: Response) {
    try {
      const { startDate, endDate, format = 'json' } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const report = await adminService.generateBookingReport(
        new Date(startDate as string),
        new Date(endDate as string),
        format as 'json' | 'csv' | 'pdf'
      );

      if (format === 'csv' || format === 'pdf') {
        res.setHeader('Content-Type', `application/${format}`);
        res.setHeader('Content-Disposition', `attachment; filename=booking-report.${format}`);
      }

      res.send(report);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  }
} 