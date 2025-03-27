import { NextRequest } from 'next/server';
import { Server as HTTPServer } from 'http';
import { Socket } from 'net';
import { WebSocketServer } from 'ws';

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
let wsServer: WebSocketServer | null = null;

/**
 * Get the singleton WebSocket server instance
 */
function getWebSocketServer(): WebSocketServer {
  if (!wsServer) {
    wsServer = createWebSocketHandler();
    logger.info({ 
      event: WebSocketServerEvent.INIT 
    }, 'WebSocket server initialized');
  }
  return wsServer;
}

/**
 * Handles WebSocket connection requests through Next.js API routes.
 * 
 * @param req - The incoming request
 */
export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Set up the WebSocket server
    const wsServerInstance = getWebSocketServer();
    
    // Next.js App Router doesn't directly support WebSockets
    // We need to access the underlying socket
    const { socket, response } = await tryUpgradeConnection(req);
    
    if (!socket) {
      return new Response('Failed to setup WebSocket', { status: 400 });
    }
    
    // Socket successfully upgraded
    return response;
  } catch (error) {
    logger.error({ 
      error, 
      event: WebSocketServerEvent.ERROR 
    }, 'Error handling WebSocket route');
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Try to upgrade the HTTP connection to a WebSocket connection
 * 
 * @param req - The incoming request
 * @returns The socket and response if successful
 */
async function tryUpgradeConnection(req: NextRequest): Promise<{ socket: Socket | null; response: Response }> {
  const { headers } = req;
  const upgradeHeader = headers.get('upgrade');
  
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
    return {
      socket: null,
      response: new Response('Expected WebSocket connection', { status: 400 })
    };
  }
  
  // We need to create a Response object with status 101 (Switching Protocols)
  const res = new Response(null, {
    status: 101,
    statusText: 'Switching Protocols',
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
      'Sec-WebSocket-Accept': headers.get('sec-websocket-key') || '',
    }
  });
  
  return {
    socket: null, // In App Router, we can't directly access the socket
    response: res
  };
} 