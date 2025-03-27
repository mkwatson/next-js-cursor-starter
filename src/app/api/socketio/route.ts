import { NextRequest } from 'next/server';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from '@/lib/logger';
import { z } from 'zod';

// Define message schema for validation
const messageSchema = z.object({
  type: z.string(),
  data: z.unknown(),
  timestamp: z.string().optional()
});

// Socket.IO server instance (singleton)
let io: Server | null = null;
// HTTP server instance (singleton)
let httpServer: ReturnType<typeof createServer> | null = null;

/**
 * Initialize Socket.IO server if it doesn't exist
 */
function initSocketIOServer() {
  logger.info({ event: 'server_init' }, 'Socket.IO server initialized');
  
  try {
    // Create HTTP server if it doesn't exist
    if (!httpServer) {
      httpServer = createServer();
      
      // Use a dynamic port or leave it to the system to pick an available port
      // This avoids the EADDRINUSE error when restarting the server
      httpServer.listen(0);
    }
    
    // Create Socket.IO server if it doesn't exist
    if (!io) {
      io = new Server(httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        },
        path: '/api/socketio'
      });

      // Handle Socket.IO connection
      io.on('connection', (socket) => {
        const clientId = socket.id;
        logger.info({ event: 'connection', clientId }, 'Client connected');
        
        // Handle client messages
        socket.on('message', (message) => {
          try {
            // Validate message format
            const validatedMessage = messageSchema.parse(message);
            
            logger.info({ event: 'message', clientId, message: validatedMessage }, 'Message received');
            
            // Echo message back to acknowledge receipt
            socket.emit('message', {
              type: 'acknowledgement',
              data: validatedMessage,
              timestamp: new Date().toISOString()
            });
            
            // Broadcast message to all other clients if needed
            // socket.broadcast.emit('message', validatedMessage);
          } catch (error) {
            logger.error({ event: 'error', clientId, error }, 'Invalid message format');
            
            // Send error response
            socket.emit('error', {
              type: 'error',
              message: 'Invalid message format',
              timestamp: new Date().toISOString()
            });
          }
        });
        
        // Handle disconnection
        socket.on('disconnect', () => {
          logger.info({ event: 'disconnect', clientId }, 'Client disconnected');
        });
        
        // Handle errors
        socket.on('error', (error) => {
          logger.error({ event: 'error', clientId, error }, 'Socket error');
        });
      });
    }
    
    return io;
  } catch (error) {
    logger.error({ event: 'server_error', error }, 'Failed to initialize Socket.IO server');
    throw error;
  }
}

/**
 * HTTP route handler for Socket.IO
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Initialize Socket.IO server
    initSocketIOServer();
    
    // Required for Socket.IO long polling
    if (req.headers.get('accept') === 'text/html') {
      return new Response('Socket.IO server', { status: 200 });
    }
    
    // For WebSocket connections, return a 426 to trigger upgrade
    if (req.headers.get('upgrade') === 'websocket') {
      return new Response('WebSocket Upgrade Required', { status: 426 });
    }
    
    // For Socket.IO polling, respond with 200
    return new Response('Socket.IO OK', { status: 200 });
  } catch (error) {
    logger.error({ error, event: 'socketio_route_error' }, 'Error in Socket.IO route');
    return new Response('Internal Server Error', { status: 500 });
  }
} 