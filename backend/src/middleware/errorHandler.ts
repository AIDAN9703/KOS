import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    switch (err.code) {
      case 'P2002': return res.status(409).json({ error: 'Resource already exists' });
      case 'P2025': return res.status(404).json({ error: 'Resource not found' });
      default: return res.status(400).json({ error: 'Database error' });
    }
  }
  
  res.status(500).json({ error: 'Internal server error' });
};
