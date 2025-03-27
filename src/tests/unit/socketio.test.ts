// Built-in imports
import http from 'http';

// External dependencies
import { Server } from 'socket.io';
import { io as ioc, Socket as ClientSocket } from 'socket.io-client';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Internal imports
import logger from '../../lib/logger';

// Mock the logger
vi.mock('../../lib/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Socket.IO Server', () => {
  let httpServer: http.Server;
  let io: Server;
  let clientSocket: ClientSocket;
  
  beforeEach(() => {
    return new Promise<void>((resolve) => {
      // Create HTTP server
      httpServer = http.createServer();
      
      // Create Socket.IO server
      io = new Server(httpServer);
      
      // Set up Socket.IO event handlers
      io.on('connection', (socket) => {
        // Log connection
        logger.info(
          { event: 'connection', clientId: socket.id },
          'Client connected'
        );
        
        // Handle messages
        socket.on('message', (message, callback) => {
          // Echo back the message
          callback({ status: 'ok', message });
        });
        
        // Handle disconnection
        socket.on('disconnect', () => {
          logger.info(
            { event: 'disconnection', clientId: socket.id },
            `Client disconnected: ${socket.id}`
          );
        });
      });
      
      // Start the server
      httpServer.listen(() => {
        const port = (httpServer.address() as any).port;
        
        // Create client socket
        clientSocket = ioc(`http://localhost:${port}`);
        
        // Wait for connection
        clientSocket.on('connect', () => {
          resolve();
        });
      });
    });
  });
  
  afterEach(() => {
    return new Promise<void>((resolve) => {
      // Disconnect client
      if (clientSocket.connected) {
        clientSocket.disconnect();
      }
      
      // Stop server
      io.close(() => {
        httpServer.close(() => {
          resolve();
        });
      });
    });
  });
  
  test('should establish a connection', () => {
    // Verify connection is logged
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'connection' }),
      expect.stringContaining('Client connected')
    );
  });
  
  test('should handle messages from clients', () => {
    return new Promise<void>((resolve) => {
      // Send a test message
      clientSocket.emit('message', 'test message', (response: { status: string, message: string }) => {
        // Verify the response
        expect(response).toEqual({
          status: 'ok',
          message: 'test message',
        });
        resolve();
      });
    });
  });
  
  test('should handle client disconnection', () => {
    return new Promise<void>((resolve) => {
      // Clear previous calls to logger.info
      vi.clearAllMocks();
      
      // Set up event listener for post-disconnection check
      clientSocket.on('disconnect', () => {
        // Give the server a moment to log the disconnection
        setTimeout(() => {
          // Verify disconnection is logged
          expect(logger.info).toHaveBeenCalledWith(
            expect.objectContaining({ event: 'disconnection' }),
            expect.stringContaining('Client disconnected')
          );
          resolve();
        }, 100);
      });
      
      // Disconnect the client
      clientSocket.disconnect();
    });
  });
  
  test('should handle connection errors', () => {
    return new Promise<void>((resolve) => {
      // Create a new client socket that will fail to connect
      const badSocket = ioc('http://localhost:1234', {
        reconnection: false,
        timeout: 300
      });
      
      // Listen for connection error
      badSocket.on('connect_error', (err) => {
        expect(err).toBeDefined();
        badSocket.close();
        resolve();
      });
    });
  }, 6000); // Increase timeout to 6 seconds
}); 