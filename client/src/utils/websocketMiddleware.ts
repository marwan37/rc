// src/store/websocketMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import io, { Socket } from 'socket.io-client';
import { RootState } from '@/store';
import { WebSocketActionTypes, WEBSOCKET_CONNECT, SEND_MESSAGE, NEW_MESSAGE_RECEIVED } from '@/types/WebSocket';
import { Message } from '@/types/Message';

const createWebSocketMiddleware = (): Middleware<{}, RootState, any> => {
  let socket: Socket | null = null;

  return store => next => (action: WebSocketActionTypes) => {
    switch (action.type) {
      case WEBSOCKET_CONNECT:
        socket = io('http://localhost:3001');

        socket.on('connect', () => {
          console.log('Connected to WebSocket server');
        });

        socket.on('message', (message: Message) => {
          store.dispatch({ type: NEW_MESSAGE_RECEIVED, payload: message });
        });

        break;
      case SEND_MESSAGE:
        socket?.emit('message', action.payload);
        break;
      default:
        break;
    }

    return next(action);
  };
};

export default createWebSocketMiddleware;
