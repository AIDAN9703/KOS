import { Server as HTTPServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import 'dotenv/config';

class SocketService {
  private io: SocketIOServer | null = null;

  init(server: HTTPServer): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.FRONTEND_URL 
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    return this.io;
  }

  getIO(): SocketIOServer | null {
    if (!this.io) {
      return null;
    }
    return this.io;
  }
}

export default new SocketService(); 