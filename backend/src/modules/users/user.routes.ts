import { Router, RequestHandler } from 'express';
import { UserController } from './user.controller.js';
import { authenticate, isAdmin } from '../auth/auth.middleware.js';

const router = Router();
const userController = new UserController();

// User routes
router.get(
  '/profile', 
  authenticate as RequestHandler, 
  userController.getProfile.bind(userController)
);

router.put(
  '/profile', 
  authenticate as RequestHandler, 
  userController.updateProfile.bind(userController)
);

// Admin routes
router.get(
  '/', 
  authenticate as RequestHandler, 
  isAdmin as RequestHandler, 
  userController.getAllUsers.bind(userController)
);

export default router; 