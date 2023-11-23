import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { WebSocketActionTypes, WEBSOCKET_CONNECT, SEND_MESSAGE, NEW_MESSAGE_RECEIVED } from '@/types/WebSocket';
import { Message } from '@/types/Message';

class WebSocketClient {
  private socket: WebSocket;
  private listeners: { [event: string]: Function[] };

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.listeners = {};
  }

  private onOpen() {
    this.emit('connect');
  }

  private onClose() {
    this.emit('disconnect');
  }

  private onError(error: Event) {
    this.emit('error', error);
  }

  private onMessage(event: MessageEvent) {
    const message = JSON.parse(event.data);
    this.emit('message', message);
  }

  private emit(event: string, data?: any) {
    this.listeners[event]?.forEach(fn => fn(data));
  }

  public on(event: string, fn: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }

  public off(event: string, fn: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(listener => listener !== fn);
    }
  }

  public sendMessage(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}

const createWebSocketMiddleware = (): Middleware<{}, RootState, any> => {
  let webSocketClient: WebSocketClient | null = null;


  return store => next => (action: WebSocketActionTypes) => {
    switch (action.type) {
      case WEBSOCKET_CONNECT:
        console.log('Attempting to connect to WebSocket...');
        webSocketClient = new WebSocketClient('ws://localhost:3001/ws');
        webSocketClient.on('connect', () => console.log('WebSocket connected'));
        webSocketClient.on('disconnect', () => console.log('WebSocket disconnected'));
        webSocketClient.on('error', (error: any) => console.error('WebSocket error:', error));
        webSocketClient.on('message', (message: Message) => {
          console.log('WebSocket message received:', message);
          store.dispatch({ type: NEW_MESSAGE_RECEIVED, payload: message });
        });
        break;
      case SEND_MESSAGE:
        webSocketClient?.sendMessage(action.payload);
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default createWebSocketMiddleware;
