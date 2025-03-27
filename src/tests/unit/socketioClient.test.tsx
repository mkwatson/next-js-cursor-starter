/**
 * @vitest-environment jsdom
 */

import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WebSocketStatus from '../../components/WebSocketStatus';
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Set up global React for testing environment
global.React = React;

// Mock the socket.io-client module
vi.mock('socket.io-client', () => {
  const onMock = vi.fn();
  const emitMock = vi.fn();
  const connectMock = vi.fn();
  const disconnectMock = vi.fn();

  return {
    io: vi.fn(() => ({
      on: onMock,
      emit: emitMock,
      connect: connectMock,
      disconnect: disconnectMock,
      id: 'test-socket-id',
      connected: false
    }))
  };
});

// Import the mocked module
import { io } from 'socket.io-client';

describe('WebSocketStatus Component', () => {
  const mockIO = vi.mocked(io);
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should display disconnected status initially', () => {
    // Create a mock socket with initial state
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      connected: false,
      id: null
    };
    
    mockIO.mockImplementation(() => mockSocket as any);

    render(<WebSocketStatus />);
    
    expect(screen.getByText('Status: Disconnected')).toBeInTheDocument();
  });

  test('should display connecting status when connecting', async () => {
    // Create a mock socket
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      connected: false,
      id: null
    };
    
    mockIO.mockImplementation(() => mockSocket as any);

    render(<WebSocketStatus />);
    
    await waitFor(() => {
      expect(screen.getByText('Status: Connecting...')).toBeInTheDocument();
    });
  });

  test('should update status to connected when socket connects', async () => {
    // Create a mock socket
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      connected: false,
      id: 'test-socket-id'
    };
    
    // Store the 'connect' event callback to trigger later
    let connectCallback: () => void;
    
    mockSocket.on.mockImplementation((event: string, callback: any) => {
      if (event === 'connect') {
        connectCallback = callback;
      }
      return mockSocket;
    });
    
    mockIO.mockImplementation(() => mockSocket as any);

    render(<WebSocketStatus />);
    
    // Simulate connection success
    connectCallback!();
    mockSocket.connected = true;
    
    await waitFor(() => {
      expect(screen.getByText('Status: Connected')).toBeInTheDocument();
    });
  });

  test('should handle socket errors', async () => {
    // Create a mock socket
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      connected: false,
      id: null
    };
    
    // Store the 'connect_error' event callback to trigger later
    let errorCallback: (error: Error) => void;
    
    mockSocket.on.mockImplementation((event: string, callback: any) => {
      if (event === 'connect_error') {
        errorCallback = callback;
      }
      return mockSocket;
    });
    
    mockIO.mockImplementation(() => mockSocket as any);

    render(<WebSocketStatus />);
    
    // Simulate connection error
    errorCallback!(new Error('Connection failed'));
    
    await waitFor(() => {
      expect(screen.getByText('Error: Connection error: Connection failed')).toBeInTheDocument();
    });
  });

  test('should handle sending messages when connected', async () => {
    // Create a mock socket
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      connected: true,
      id: 'test-socket-id'
    };
    
    mockIO.mockImplementation(() => mockSocket as any);

    render(<WebSocketStatus />);
    
    // Find and click send button
    const sendButton = screen.getByText('Send Test Message');
    fireEvent.click(sendButton);
    
    expect(mockSocket.emit).toHaveBeenCalledWith('message', expect.objectContaining({
      type: 'test',
      data: expect.any(String)
    }));
  });

  test('should display received messages', async () => {
    // Create a mock socket
    const mockSocket = {
      on: vi.fn(),
      emit: vi.fn(),
      connect: vi.fn(),
      connected: true,
      id: 'test-socket-id'
    };
    
    // Store the 'message' event callback to trigger later
    let messageCallback: (message: string) => void;
    
    mockSocket.on.mockImplementation((event: string, callback: any) => {
      if (event === 'message') {
        messageCallback = callback;
      }
      return mockSocket;
    });
    
    mockIO.mockImplementation(() => mockSocket as any);

    render(<WebSocketStatus />);
    
    // Simulate receiving a message
    messageCallback!('Test message from server');
    
    await waitFor(() => {
      expect(screen.getByText('Test message from server')).toBeInTheDocument();
    });
  });
}); 