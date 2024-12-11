import { Request, Response } from 'express'
import { BoatService } from './boat.service.js'

const boatService = new BoatService()

export class BoatController {
  async getAllBoats(req: Request, res: Response) {
    try {
      const boats = await boatService.getAllBoats()
      res.json(boats)
    } catch (error) {
      console.error('Error fetching boats:', error)
      res.status(500).json({ error: 'Failed to fetch boats' })
    }
  }

  async getBoat(req: Request, res: Response) {
    try {
      const boat = await boatService.getBoat(Number(req.params.id))
      if (!boat) {
        return res.status(404).json({ error: 'Boat not found' })
      }
      res.json(boat)
    } catch (error) {
      console.error('Error fetching boat:', error)
      res.status(500).json({ error: 'Failed to fetch boat' })
    }
  }

  async getBoatAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const availability = await boatService.getBoatAvailability(
        Number(id),
        startDate as string,
        endDate as string
      );

      res.json(availability);
    } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  }

  async getBoatPrices(req: Request, res: Response) {
    try {
      const { date } = req.query
      const prices = await boatService.getBoatPrices(
        Number(req.params.id),
        new Date(date as string)
      )
      res.json(prices)
    } catch (error) {
      console.error('Error fetching prices:', error)
      res.status(500).json({ error: 'Failed to fetch prices' })
    }
  }

  async searchBoats(req: Request, res: Response) {
    try {
      const { location, startDate, endDate, capacity, type, minPrice, maxPrice } = req.query
      const boats = await boatService.searchBoats({
        location: location as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        capacity: capacity ? Number(capacity) : undefined,
        type: type as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined
      })
      res.json(boats)
    } catch (error) {
      console.error('Error searching boats:', error)
      res.status(500).json({ error: 'Failed to search boats' })
    }
  }

  async getFeaturedBoats(req: Request, res: Response) {
    try {
      const boats = await boatService.getFeaturedBoats()
      res.json(boats)
    } catch (error) {
      console.error('Error fetching featured boats:', error)
      res.status(500).json({ error: 'Failed to fetch featured boats' })
    }
  }

  async getBoatReviews(req: Request, res: Response) {
    try {
      const reviews = await boatService.getBoatReviews(Number(req.params.id))
      res.json(reviews)
    } catch (error) {
      console.error('Error fetching boat reviews:', error)
      res.status(500).json({ error: 'Failed to fetch reviews' })
    }
  }

  async getBoatBookingHistory(req: Request, res: Response) {
    try {
      const bookings = await boatService.getBoatBookingHistory(Number(req.params.id))
      res.json(bookings)
    } catch (error) {
      console.error('Error fetching booking history:', error)
      res.status(500).json({ error: 'Failed to fetch booking history' })
    }
  }

  async getSimilarBoats(req: Request, res: Response) {
    try {
      const boats = await boatService.getSimilarBoats(
        Number(req.params.id),
        Number(req.query.limit)
      )
      res.json(boats)
    } catch (error) {
      console.error('Error fetching similar boats:', error)
      res.status(500).json({ error: 'Failed to fetch similar boats' })
    }
  }

  async getPopularBoatsInLocation(req: Request, res: Response) {
    try {
      const { location, limit } = req.query
      const boats = await boatService.getPopularBoatsInLocation(
        location as string,
        Number(limit)
      )
      res.json(boats)
    } catch (error) {
      console.error('Error fetching popular boats:', error)
      res.status(500).json({ error: 'Failed to fetch popular boats' })
    }
  }

  async getLastMinuteDeals(req: Request, res: Response) {
    try {
      const { days } = req.query
      const deals = await boatService.getLastMinuteDeals(Number(days))
      res.json(deals)
    } catch (error) {
      console.error('Error fetching last-minute deals:', error)
      res.status(500).json({ error: 'Failed to fetch deals' })
    }
  }

  async getBoatStats(req: Request, res: Response) {
    try {
      const stats = await boatService.getBoatStats(Number(req.params.id))
      res.json(stats)
    } catch (error) {
      console.error('Error fetching boat stats:', error)
      res.status(500).json({ error: 'Failed to fetch stats' })
    }
  }

  async getBoatCalendar(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query
      const calendar = await boatService.getBoatCalendar(
        Number(req.params.id),
        new Date(startDate as string),
        new Date(endDate as string)
      )
      res.json(calendar)
    } catch (error) {
      console.error('Error fetching boat calendar:', error)
      res.status(500).json({ error: 'Failed to fetch calendar' })
    }
  }

  async getBoatReviewStats(req: Request, res: Response) {
    try {
      const stats = await boatService.getBoatStats(Number(req.params.id));
      res.json({
        averageRating: stats.reviews.averageRating,
        totalReviews: stats.reviews.count,
        breakdown: {
          cleanliness: stats.reviews.averageCleanliness,
          communication: stats.reviews.averageCommunication,
          accuracy: stats.reviews.averageAccuracy
        }
      });
    } catch (error) {
      console.error('Error fetching review stats:', error);
      res.status(500).json({ error: 'Failed to fetch review stats' });
    }
  }

  async getPriceRange(req: Request, res: Response) {
    try {
      const range = await boatService.getPriceRange();
      res.json(range);
    } catch (error) {
      console.error('Error fetching price range:', error);
      res.status(500).json({ error: 'Failed to fetch price range' });
    }
  }
} 