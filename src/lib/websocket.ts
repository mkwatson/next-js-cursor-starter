// External imports
import { WebSocketServer, WebSocket } from 'ws';
import { z } from 'zod';

// Internal imports
import logger from '@/lib/logger';

/**
 * WebSocket event types for real-time communication
 */
export enum WebSocketEventType {
  MESSAGE = 'message',
  ACKNOWLEDGEMENT = 'acknowledgement',
  ERROR = 'error',
}

/**
 * Base message schema for WebSocket communication
 */
export const WebSocketMessageSchema = z.object({
  type: z.string(),
  data: z.unknown(),
});

/**
 * Type inference for WebSocket messages
 */
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

/**
 * Creates and configures a WebSocket server for real-time communication.
 * 
 * @returns A configured WebSocket server instance
 */
export function createWebSocketHandler(): WebSocketServer {
  const wss = new WebSocketServer({ 
    noServer: true 
  });

  // Handle connection event
  wss.on('connection', (ws: WebSocket) => {
    logger.info({ event: 'connection' }, 'WebSocket connection established');

    // Handle messages from client
    ws.on('message', (data: Buffer) => {
      try {
        const messageString = data.toString();
        // Explicitly type the parsed data as unknown for safety
        const parsedData = JSON.parse(messageString) as unknown;
        
        // Validate message format
        const validationResult = WebSocketMessageSchema.safeParse(parsedData);
        
        if (!validationResult.success) {
          logger.warn({
            event: 'message_invalid',
            errors: validationResult.error.format(),
          }, 'Invalid message format received');
          
          // Send error response
          ws.send(JSON.stringify({
            type: WebSocketEventType.ERROR,
            data: 'Invalid message format'
          }));
          return;
        }
        
        const parsedMessage = validationResult.data;
        
        logger.info({ 
          event: 'message', 
          message: parsedMessage 
        }, 'Message received from client');

        // Send acknowledgement to client
        ws.send(JSON.stringify({
          type: WebSocketEventType.ACKNOWLEDGEMENT,
          data: 'Message received'
        }));
      } catch (error) {
        logger.error({ 
          error, 
          event: 'message_error' 
        }, 'Error processing client message');
        
        // Send error response for parse errors
        ws.send(JSON.stringify({
          type: WebSocketEventType.ERROR,
          data: 'Could not process message'
        }));
      }
    });

    // Handle client disconnect
    ws.on('close', () => {
      logger.info({ event: 'disconnection' }, 'WebSocket connection closed');
    });

    // Handle connection errors
    ws.on('error', (error) => {
      logger.error({ 
        error, 
        event: 'connection_error' 
      }, 'WebSocket connection error');
    });
  });

  return wss;
} 