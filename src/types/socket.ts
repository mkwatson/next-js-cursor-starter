import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

/**
 * Extended interface for Next.js API Response with Socket.IO
 */
export interface NextApiResponseServerIO {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
} 