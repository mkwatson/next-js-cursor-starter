'use client';

// External dependencies
import { useState, useEffect, useRef } from 'react';
import { WebSocketMessage } from '@/types/websocket';

/**
 * Status of the WebSocket connection
 */
enum ConnectionStatus {
  CONNECTING = 'Connecting...',
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Connection Error',
}

/**
 * Component that displays the status of the WebSocket connection
 * and allows sending test messages to verify communication.
 * 
 * @returns React component for WebSocket testing
 */
export default function WebSocketStatus(): React.ReactElement {
  // State for tracking connection status and messages
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  // Reference to the WebSocket instance
  const webSocketRef = useRef<WebSocket | null>(null);

  /**
   * Connect to the WebSocket server
   */
  const connectSocket = (): void => {
    try {
      // Check if already connected
      if (webSocketRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      // Update UI state to connecting
      setIsConnecting(true);
      setStatus(ConnectionStatus.CONNECTING);
      setMessages(prev => [...prev, 'Attempting to connect...']);
      
      // Create WebSocket connection to our API route
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/websocket`;
      
      const socket = new WebSocket(wsUrl);
      webSocketRef.current = socket;
      
      // Handle successful connection
      socket.onopen = () => {
        setStatus(ConnectionStatus.CONNECTED);
        setError(null);
        setIsConnecting(false);
        setMessages(prev => [...prev, 'WebSocket connection established']);
      };
      
      // Handle incoming messages
      socket.onmessage = (event) => {
        try {
          // Try to parse as JSON first
          const data = JSON.parse(event.data);
          setMessages(prev => [...prev, `Received: ${JSON.stringify(data)}`]);
        } catch (error) {
          // Handle raw text messages
          setMessages(prev => [...prev, `Received raw: ${event.data}`]);
        }
      };
      
      // Handle disconnection
      socket.onclose = () => {
        setStatus(ConnectionStatus.DISCONNECTED);
        setIsConnecting(false);
        setMessages(prev => [...prev, 'WebSocket connection closed']);
        webSocketRef.current = null;
      };
      
      // Handle connection errors
      socket.onerror = (event) => {
        setStatus(ConnectionStatus.ERROR);
        setError('Connection error');
        setIsConnecting(false);
        setMessages(prev => [...prev, `WebSocket error: ${event.type}`]);
      };
    } catch (error) {
      // Handle exceptions during connection setup
      setStatus(ConnectionStatus.ERROR);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsConnecting(false);
      setMessages(prev => [
        ...prev,
        `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      ]);
    }
  };
  
  // Clean up WebSocket connection when component unmounts
  useEffect(() => {
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
        webSocketRef.current = null;
      }
    };
  }, []);
  
  /**
   * Send a test message to the WebSocket server
   */
  const sendTestMessage = (): void => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      // Create a test message
      const testMessage: WebSocketMessage = {
        type: 'test',
        data: `Test message sent at ${new Date().toISOString()}`
      };
      
      // Send the serialized message
      webSocketRef.current.send(JSON.stringify(testMessage));
      setMessages(prev => [...prev, `Sent: ${JSON.stringify(testMessage)}`]);
    } else {
      setError('Cannot send message: WebSocket is not connected');
    }
  };
  
  // Color coding for different connection statuses
  const statusColor = {
    [ConnectionStatus.CONNECTING]: 'text-yellow-500',
    [ConnectionStatus.CONNECTED]: 'text-green-500',
    [ConnectionStatus.DISCONNECTED]: 'text-gray-500',
    [ConnectionStatus.ERROR]: 'text-red-500',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className={`font-semibold ${statusColor[status]}`}>
          Status: {status}
        </div>
        
        {/* Connection indicator */}
        <div 
          className={`w-3 h-3 rounded-full ${
            status === ConnectionStatus.CONNECTED 
              ? 'bg-green-500' 
              : status === ConnectionStatus.CONNECTING
                ? 'bg-yellow-500'
                : 'bg-red-500'
          }`}
        />
      </div>
      
      {/* Display error message if any */}
      {error && (
        <div className="text-red-500 text-sm">
          Error: {error}
        </div>
      )}
      
      {/* Connection controls */}
      <div className="mt-4">
        <button
          onClick={connectSocket}
          disabled={status === ConnectionStatus.CONNECTED || isConnecting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed mr-2"
        >
          Connect
        </button>
        
        <button
          onClick={sendTestMessage}
          disabled={status !== ConnectionStatus.CONNECTED}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send Test Message
        </button>
      </div>
      
      {/* Message log */}
      {messages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Message Log:</h3>
          <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs h-40 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className="mb-1">
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 