export const runtime = 'edge';

import { NextRequest } from 'next/server';
import logger from '@/lib/logger';
import { WebSocketMessage } from '@/types/websocket';

// Define event types
const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  ERROR: 'error',
};

/**
 * WebSocket API route handler for Next.js App Router
 * 
 * This handler uses the native WebSockets support in Next.js App Router.
 * WebSocketPair is a Web API available in Next.js Edge Runtime.
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Check if the request is a WebSocket upgrade request
    if (req.headers.get('upgrade') !== 'websocket') {
      return new Response('Expected Websocket', { status: 426 });
    }

    // Create a WebSocket pair for client and server
    const { socket, response } = await createWebSocketPair();
    
    // Set up event handlers for the server socket
    socket.addEventListener('open', () => {
      logger.info({ event: EVENTS.CONNECTION }, 'WebSocket connection established');
      
      // Send a welcome message to the client
      socket.send(JSON.stringify({
        type: 'connection',
        data: 'Connected to WebSocket server',
        timestamp: new Date().toISOString(),
      }));
    });
    
    socket.addEventListener('message', (event) => {
      try {
        // Try to parse the message as JSON
        const message = JSON.parse(event.data as string) as WebSocketMessage;
        logger.info({ event: EVENTS.MESSAGE, message }, 'Message received');
        
        // Echo the message back to the client as acknowledgment
        socket.send(JSON.stringify({
          type: 'acknowledgement',
          data: message,
          timestamp: new Date().toISOString(),
        }));
      } catch (error) {
        // Handle message parsing errors
        logger.error({ error, event: EVENTS.ERROR }, 'Error processing message');
        
        // Send error response to client
        socket.send(JSON.stringify({
          type: 'error',
          data: 'Invalid message format',
          timestamp: new Date().toISOString(),
        }));
      }
    });
    
    socket.addEventListener('close', () => {
      logger.info({ event: EVENTS.DISCONNECT }, 'WebSocket connection closed');
    });
    
    socket.addEventListener('error', (event) => {
      logger.error({ event: EVENTS.ERROR }, 'WebSocket error');
    });

    return response;
  } catch (error) {
    // Handle any uncaught errors
    logger.error({ error, event: 'websocket_route_error' }, 'Error in WebSocket route');
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Create a pair of WebSockets for client and server
 * 
 * This function creates a WebSocketPair and returns the server-side socket
 * along with a properly configured Response object for the client.
 */
async function createWebSocketPair(): Promise<{ socket: WebSocket; response: Response }> {
  // @ts-ignore - WebSocketPair is available in Next.js Edge Runtime but not typed in TypeScript
  const { 0: clientSocket, 1: serverSocket } = new WebSocketPair();
  
  return {
    socket: serverSocket,
    response: new Response(null, {
      status: 101,
      // @ts-ignore - The webSocket property is supported in Next.js Edge Runtime
      webSocket: clientSocket,
    }),
  };
} 