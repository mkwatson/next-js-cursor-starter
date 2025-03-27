/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import WebSocketStatus from '../../components/WebSocketStatus';
import { WebSocketMessage } from '../../types/websocket';

// Set up global React for testing environment
global.React = React;

// Properly mock React
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn().mockImplementation(() => ({ current: null })),
  };
});

// Mock WebSocket
class MockWebSocket {
  url: string;
  readyState: number = WebSocket.CLOSED;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  
  constructor(url: string) {
    this.url = url;
  }
  
  send(data: string): void {
    // Mock implementation
  }
  
  close(): void {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      const closeEvent = new CloseEvent('close');
      this.onclose(closeEvent);
    }
  }
  
  // Helper methods for tests
  mockOpen(): void {
    this.readyState = WebSocket.OPEN;
    if (this.onopen) {
      const openEvent = new Event('open');
      this.onopen(openEvent);
    }
  }
  
  mockMessage(data: WebSocketMessage | string): void {
    if (this.onmessage) {
      const messageData = typeof data === 'string' ? data : JSON.stringify(data);
      const messageEvent = { data: messageData } as MessageEvent;
      this.onmessage(messageEvent);
    }
  }
  
  mockError(): void {
    if (this.onerror) {
      const errorEvent = new Event('error');
      this.onerror(errorEvent);
    }
  }
}

// Setup global mocks
vi.stubGlobal('WebSocket', MockWebSocket);

describe('WebSocketStatus Component', () => {
  let mockWS: MockWebSocket;
  
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
    
    // Spy on WebSocket constructor
    vi.spyOn(window, 'WebSocket').mockImplementation((url: string | URL, protocols?: string | string[]) => {
      mockWS = new MockWebSocket(typeof url === 'string' ? url : url.toString());
      return mockWS as unknown as WebSocket;
    });
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  test('should display disconnected status initially', () => {
    render(<WebSocketStatus />);
    expect(screen.getByText('Status: Disconnected')).toBeInTheDocument();
  });
  
  test('should display connecting status when connect button is clicked', async () => {
    render(<WebSocketStatus />);
    
    // Find and click connect button
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    
    // Check for connecting status
    expect(screen.getByText('Status: Connecting...')).toBeInTheDocument();
    
    // Check WebSocket was created with correct URL
    expect(window.WebSocket).toHaveBeenCalledWith(expect.stringContaining('/api/websocket'));
  });
  
  test('should update status to connected when WebSocket connects', async () => {
    render(<WebSocketStatus />);
    
    // Find and click connect button
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    
    // Simulate successful connection
    mockWS.mockOpen();
    
    // Check connection status updated
    await waitFor(() => {
      expect(screen.getByText('Status: Connected')).toBeInTheDocument();
    });
    
    // Check connection message
    expect(screen.getByText('WebSocket connection established')).toBeInTheDocument();
  });
  
  test('should handle receiving valid JSON messages', async () => {
    render(<WebSocketStatus />);
    
    // Connect
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    mockWS.mockOpen();
    
    // Simulate receiving a message
    const testMessage: WebSocketMessage = {
      type: 'test',
      data: 'Hello from server'
    };
    mockWS.mockMessage(testMessage);
    
    // Check message is displayed
    await waitFor(() => {
      expect(screen.getByText(expect.stringContaining(JSON.stringify(testMessage)))).toBeInTheDocument();
    });
  });
  
  test('should handle receiving raw string messages', async () => {
    render(<WebSocketStatus />);
    
    // Connect
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    mockWS.mockOpen();
    
    // Simulate receiving a raw message
    const rawMessage = 'Raw message data';
    mockWS.mockMessage(rawMessage);
    
    // Check message is displayed as raw
    await waitFor(() => {
      expect(screen.getByText(`Received raw: ${rawMessage}`)).toBeInTheDocument();
    });
  });
  
  test('should handle WebSocket error events', async () => {
    render(<WebSocketStatus />);
    
    // Connect
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    
    // Simulate connection error
    mockWS.mockError();
    
    // Check error status
    await waitFor(() => {
      expect(screen.getByText('Status: Connection Error')).toBeInTheDocument();
    });
    
    // Check error message
    expect(screen.getByText('Error: Connection error')).toBeInTheDocument();
  });
  
  test('should handle sending messages when connected', async () => {
    render(<WebSocketStatus />);
    
    // Connect
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    mockWS.mockOpen();
    
    // Spy on send method
    const sendSpy = vi.spyOn(mockWS, 'send');
    
    // Send a test message
    const sendButton = screen.getByText('Send Test Message');
    fireEvent.click(sendButton);
    
    // Verify WebSocket.send was called with a JSON message
    expect(sendSpy).toHaveBeenCalledWith(expect.stringContaining('test'));
    
    // Check sent message is displayed
    expect(screen.getByText(expect.stringContaining('Sent:'))).toBeInTheDocument();
  });
  
  test('should handle attempt to send when disconnected', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<WebSocketStatus />);
    
    // Try to send without connecting
    const sendButton = screen.getByText('Send Test Message');
    expect(sendButton).toBeDisabled();
    
    // Verify send button is disabled when not connected
    expect(sendButton).toHaveProperty('disabled', true);
    
    consoleSpy.mockRestore();
  });
  
  test('should handle disconnection properly', async () => {
    render(<WebSocketStatus />);
    
    // Connect
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    mockWS.mockOpen();
    
    // Simulate disconnection
    mockWS.close();
    
    // Check disconnected status
    await waitFor(() => {
      expect(screen.getByText('Status: Disconnected')).toBeInTheDocument();
    });
    
    // Check disconnection message
    expect(screen.getByText('WebSocket connection closed')).toBeInTheDocument();
  });
  
  test('should clean up WebSocket connection on unmount', async () => {
    const { unmount } = render(<WebSocketStatus />);
    
    // Connect
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    mockWS.mockOpen();
    
    // Spy on close method
    const closeSpy = vi.spyOn(mockWS, 'close');
    
    // Unmount component
    unmount();
    
    // Verify WebSocket was closed
    expect(closeSpy).toHaveBeenCalled();
  });
  
  test('should handle connection exceptions', async () => {
    // Force WebSocket constructor to throw
    vi.spyOn(window, 'WebSocket').mockImplementation(() => {
      throw new Error('Failed to construct WebSocket');
    });
    
    render(<WebSocketStatus />);
    
    // Try to connect
    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);
    
    // Check error status
    await waitFor(() => {
      expect(screen.getByText('Status: Connection Error')).toBeInTheDocument();
    });
    
    // Check error message
    expect(screen.getByText('Error: Failed to construct WebSocket')).toBeInTheDocument();
  });
}); 