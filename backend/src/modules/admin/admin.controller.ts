import { Request, Response } from 'express'
import { AdminService } from './admin.service.js'

const adminService = new AdminService()

export class AdminController {
  // Boat Management
  async getAllBoats(req: Request, res: Response) {
    try {
      const boats = await adminService.getAllBoats()
      res.json(boats)
    } catch (error) {
      console.error('Error fetching boats:', error)
      res.status(500).json({ error: 'Failed to fetch boats' })
    }
  }

  async addNewBoat(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const { 
        name, type, length, capacity, location, description, 
        images, make, model, year, features, prices 
      } = req.body;

      // Validate required fields
      if (!name || !type || !make || !model || !year || !length || !capacity || !location || !description) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['name', 'type', 'make', 'model', 'year', 'length', 'capacity', 'location', 'description']
        });
      }

      const boat = await adminService.addNewBoat({
        name,
        type,
        make,          // Required
        model,         // Required
        year: Number(year),  // Convert to number
        length,
        capacity: Number(capacity),  // Convert to number
        location,
        description,
        images: images || [],
        prices,
        ownerId: req.user.id
      });

      res.status(201).json(boat);
    } catch (error) {
      console.error('Error creating boat:', error);
      res.status(500).json({ error: 'Failed to create boat' });
    }
  }

  async editBoat(req: Request, res: Response) {
    try {
      const { id } = req.params
      const {
        name, type, length, capacity, location, description,
        images, make, model, year, prices
      } = req.body

      const boat = await adminService.editBoat(Number(id), {
        name,
        type,
        length,
        capacity,
        location,
        description,
        images,
        make,
        model,
        year,
        prices
      })

      res.json(boat)
    } catch (error) {
      console.error('Error updating boat:', error)
      res.status(500).json({ error: 'Failed to update boat' })
    }
  }

  async deleteBoat(req: Request, res: Response) {
    // ... implementation
  }

  // User Management
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await adminService.getAllUsers()
      res.json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Failed to fetch users' })
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

  // Booking Management
  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await adminService.getAllBookings()
      res.json(bookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      res.status(500).json({ error: 'Failed to fetch bookings' })
    }
  }

  async updateBooking(req: Request, res: Response) {
    // ... implementation
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

  // Analytics
  async getBoatStatistics(req: Request, res: Response) {
    try {
      const stats = await adminService.getBoatStatistics()
      res.json(stats)
    } catch (error) {
      console.error('Error fetching boat statistics:', error)
      res.status(500).json({ error: 'Failed to fetch statistics' })
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
      const { name, category, icon } = req.body
      const feature = await adminService.updateFeature(Number(id), {
        name,
        category,
        icon
      })
      res.json(feature)
    } catch (error) {
      console.error('Error updating feature:', error)
      res.status(500).json({ error: 'Failed to update feature' })
    }
  }
} 