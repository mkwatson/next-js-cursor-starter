// Built-in imports
import http from 'http';

// External dependencies
import { WebSocket } from 'ws';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Internal imports
import { createWebSocketHandler, WebSocketEventType, WebSocketMessage } from '@/lib/websocket';
import logger from '@/lib/logger';

// Mock the logger to prevent actual logging during tests
vi.mock('@/lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('WebSocket Handler', () => {
  let httpServer: http.Server;
  let port: number;
  
  beforeEach(() => {
    // Create an HTTP server for testing
    port = 3001;
    httpServer = http.createServer();
    const wsServer = createWebSocketHandler();
    
    // Handle upgrade requests to establish WebSocket connections
    httpServer.on('upgrade', (request, socket, head) => {
      wsServer.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        wsServer.emit('connection', ws, request);
      });
    });
    
    httpServer.listen(port);
  });
  
  afterEach(() => {
    // Clean up the server after each test
    httpServer.close();
    vi.clearAllMocks();
  });
  
  it('should establish a WebSocket connection', async () => {
    // Connect to the WebSocket server
    const client = new WebSocket(`ws://localhost:${port}`);
    
    // Wait for the connection to open
    await new Promise<void>((resolve) => {
      client.on('open', () => {
        resolve();
      });
    });
    
    // Verify that the logger.info was called with connection message
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'connection' }),
      expect.stringContaining('WebSocket connection established')
    );
    
    // Close the connection
    client.close();
  });
  
  it('should handle messages from clients', async () => {
    // Connect to the WebSocket server
    const client = new WebSocket(`ws://localhost:${port}`);
    
    // Wait for the connection to open and send a test message
    await new Promise<void>((resolve) => {
      client.on('open', () => {
        client.send(JSON.stringify({ type: 'test', data: 'Hello Server' }));
        resolve();
      });
    });
    
    // Wait for message acknowledgement
    const messagePromise = new Promise<void>((resolve) => {
      client.on('message', (rawData: Buffer) => {
        const messageText = rawData.toString();
        const message = JSON.parse(messageText) as WebSocketMessage;
        expect(message).toEqual({
          type: WebSocketEventType.ACKNOWLEDGEMENT,
          data: 'Message received'
        });
        resolve();
      });
    });
    
    await messagePromise;
    
    // Verify the logger was called with message event
    const messagePattern: { event: string; message: { type: string; data: string } } = {
      event: 'message',
      message: { type: 'test', data: 'Hello Server' }
    };
    
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining(messagePattern),
      expect.stringContaining('Message received from client')
    );
    
    // Close the connection
    client.close();
  });
  
  it('should handle client disconnection', async () => {
    // Connect to the WebSocket server
    const client = new WebSocket(`ws://localhost:${port}`);
    
    // Wait for the connection to open
    await new Promise<void>((resolve) => {
      client.on('open', () => {
        resolve();
      });
    });
    
    // Close the connection and verify disconnection logging
    client.close();
    
    // Small delay to allow for disconnect event to be processed
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Verify that logger.info was called with disconnection message
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'disconnection' }),
      expect.stringContaining('WebSocket connection closed')
    );
  });
  
  it('should handle invalid message format', async () => {
    // Connect to the WebSocket server
    const client = new WebSocket(`ws://localhost:${port}`);
    
    // Wait for the connection to open
    await new Promise<void>((resolve) => {
      client.on('open', () => {
        // Send invalid message (missing required fields)
        client.send(JSON.stringify({ wrongField: 'invalid' }));
        resolve();
      });
    });
    
    // Wait for error response
    const errorPromise = new Promise<void>((resolve) => {
      client.on('message', (rawData: Buffer) => {
        const messageText = rawData.toString();
        const message = JSON.parse(messageText) as WebSocketMessage;
        expect(message).toEqual({
          type: WebSocketEventType.ERROR,
          data: 'Invalid message format'
        });
        resolve();
      });
    });
    
    await errorPromise;
    
    // Verify the logger was called with warning
    const warningPattern: { event: string; errors: unknown } = {
      event: 'message_invalid',
      errors: expect.anything()
    };
    
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining(warningPattern),
      expect.stringContaining('Invalid message format received')
    );
    
    // Close the connection
    client.close();
  });
  
  it('should handle unparseable JSON message', async () => {
    // Connect to the WebSocket server
    const client = new WebSocket(`ws://localhost:${port}`);
    
    // Wait for the connection to open
    await new Promise<void>((resolve) => {
      client.on('open', () => {
        // Send invalid JSON
        client.send('This is not JSON');
        resolve();
      });
    });
    
    // Wait for error response
    const errorPromise = new Promise<void>((resolve) => {
      client.on('message', (rawData: Buffer) => {
        const messageText = rawData.toString();
        const message = JSON.parse(messageText) as WebSocketMessage;
        expect(message).toEqual({
          type: WebSocketEventType.ERROR,
          data: 'Could not process message'
        });
        resolve();
      });
    });
    
    await errorPromise;
    
    // Verify the logger was called with error
    const errorPattern: { event: string; error: unknown } = {
      event: 'message_error',
      error: expect.anything()
    };
    
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining(errorPattern),
      expect.stringContaining('Error processing client message')
    );
    
    // Close the connection
    client.close();
  });
}); 