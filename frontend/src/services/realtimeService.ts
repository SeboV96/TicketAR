import { io, Socket } from 'socket.io-client';

class RealtimeService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
    });
  }

  onParkingUpdate(callback: () => void) {
    if (this.socket) {
      this.socket.on('parking-update', callback);
    }
  }

  onTicketCreated(callback: (ticket: any) => void) {
    if (this.socket) {
      this.socket.on('ticket-created', callback);
    }
  }

  onTicketExited(callback: (ticket: any) => void) {
    if (this.socket) {
      this.socket.on('ticket-exited', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const realtimeService = new RealtimeService();

