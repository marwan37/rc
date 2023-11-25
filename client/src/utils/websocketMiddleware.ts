import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { WebSocketActionTypes, WEBSOCKET_CONNECT, SEND_MESSAGE, NEW_MESSAGE_RECEIVED, WebSocketMessage } from '@/types/WebSocket';
import { Message } from '@/types/Message';
import { v4 } from 'uuid';

class WebSocketClient {
  socket: WebSocket;
  listeners: { [event: string]: Function[] };

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.listeners = {};
  }

  onOpen() {
    console.log('OPENING')
    this.emit('connect');
  }

  onClose() {
    console.log('CLOSING')

    this.emit('disconnect');
  }

  onError(error: Event) {
    this.emit('error', error);
  }

  onMessage(event: MessageEvent) {
    console.log('onMessage triggered')
    console.log(event)
    const message = JSON.parse(event.data);
    console.log(message)
    this.emit('newMessage', message);
  }

  emit(event: string, data?: any) {
    this.listeners[event]?.forEach(fn => fn(data));
  }

  on(event: string, fn: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }

  off(event: string, fn: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(listener => listener !== fn);
    }
  }

  sendMessage(message: any) {
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
        if (action.payload && action.payload.channelId) {
          const { channelId } = action.payload;
          const websocketURL = `ws://localhost:3001/ws?channel_id=${channelId}`;
          console.log('Attempting to connect to WebSocket...', websocketURL);
          webSocketClient = new WebSocketClient(websocketURL);
          webSocketClient.on('connect', () => console.log('WebSocket connected'));
          webSocketClient.on('disconnect', () => console.log('WebSocket disconnected'));
          webSocketClient.on('error', (error: any) => console.error('WebSocket error:', error));
          webSocketClient.on('newMessage', (message: WebSocketMessage) => {
            const adaptedMessage = {
              ID: v4(),
              CreatedAt: new Date().toISOString(),
              UpdatedAt: new Date().toISOString(),
              Content: message.Content,
              UserID: message.UserID,
              ChannelID: message.ChannelID,
              User: message.User,
            };
            console.log('WebSocket message received:', adaptedMessage);
            store.dispatch({ type: NEW_MESSAGE_RECEIVED, payload: adaptedMessage });
          });
        } else {
          console.error('WebSocket connect action missing channelId in payload');
        }
        break;
      case SEND_MESSAGE:
        console.log('sending message')
        webSocketClient?.sendMessage(action.payload);
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default createWebSocketMiddleware;
