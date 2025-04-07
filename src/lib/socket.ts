import { io, Socket } from 'socket.io-client';
import { SOCKET_URL, LOCAL_STORAGE_KEYS } from './constants';

interface SocketClientOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onTimerUpdate?: (data: any) => void;
  onTaskUpdate?: (data: any) => void;
  onGroupUpdate?: (data: any) => void;
}

class SocketClient {
  private socket: Socket | null = null;
  private options: SocketClientOptions;

  constructor(options: SocketClientOptions = {}) {
    this.options = options;
  }

  connect(): string {
    if (this.socket && this.socket.connected) {
      return this.socket.id || '';
    }

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
      throw new Error('No authentication token found');
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();

    return this.socket.id || '';
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocketId(): string {
    return this.socket?.id || '';
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      if (this.options.onConnect) {
        this.options.onConnect();
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (this.options.onDisconnect) {
        this.options.onDisconnect();
      }
    });

    this.socket.on('timer:update', (data) => {
      console.log('Timer update received:', data);
      if (this.options.onTimerUpdate) {
        this.options.onTimerUpdate(data);
      }
    });

    this.socket.on('task:update', (data) => {
      console.log('Task update received:', data);
      if (this.options.onTaskUpdate) {
        this.options.onTaskUpdate(data);
      }
    });

    this.socket.on('group:update', (data) => {
      console.log('Group update received:', data);
      if (this.options.onGroupUpdate) {
        this.options.onGroupUpdate(data);
      }
    });
  }
}

// Create a singleton instance
const socketClient = new SocketClient();

export default socketClient;