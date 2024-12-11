import { Request, Response } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      res.json(req.user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Failed to fetch profile' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { 
        firstName,
        lastName, 
        email, 
        address, 
        dateOfBirth, 
        bio, 
        preferences,
        emergencyContact 
      } = req.body;

      const updateData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(address && { address }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(bio && { bio }),
        ...(preferences && { preferences }),
        ...(emergencyContact && { emergencyContact })
      };

      const updatedUser = await this.userService.updateUser(req.user.id, updateData);
      
      if (updatedUser.emergencyContact) {
        updatedUser.emergencyContact = JSON.parse(updatedUser.emergencyContact as string);
      }

      res.json({
        data: updatedUser,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  }
} 