/**
 * WebSocket message interface
 */
export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp?: string;
}

/**
 * Global WebSocketPair API types
 */
declare global {
  interface WebSocketPairType {
    0: WebSocket; // Client socket
    1: WebSocket; // Server socket
  }
  
  var WebSocketPair: () => WebSocketPairType;
} 