// Internal imports
import logger from '@/lib/logger';
import { createWebSocketHandler } from '@/lib/websocket';

/**
 * WebSocket server events
 */
enum WebSocketServerEvent {
  INIT = 'server_init',
  ERROR = 'ws_route_error',
}

/**
 * Global WebSocket server instance
 */
let wsHandler: ReturnType<typeof createWebSocketHandler>;

/**
 * Handles WebSocket connection requests through Next.js API routes.
 * 
 * @returns A 101 Switching Protocols response to initiate WebSocket connection
 */
export function GET(): Response {
  try {
    // Only initialize the WebSocket server once
    if (!wsHandler) {
      wsHandler = createWebSocketHandler();
      logger.info({ 
        event: WebSocketServerEvent.INIT 
      }, 'WebSocket server initialized');
    }

    // Next.js doesn't support WebSockets directly in API routes, so we return
    // a 101 Switching Protocols response manually
    return new Response(null, {
      status: 101,
      statusText: 'Switching Protocols',
      headers: {
        Upgrade: 'websocket',
        Connection: 'Upgrade',
      },
    });
  } catch (error) {
    logger.error({ 
      error, 
      event: WebSocketServerEvent.ERROR 
    }, 'Error handling WebSocket route');
    return new Response('Internal Server Error', { status: 500 });
  }
} 