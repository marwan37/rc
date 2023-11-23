// src/store/websocketTypes.ts

import { Message } from './Message';

export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const NEW_MESSAGE_RECEIVED = 'NEW_MESSAGE_RECEIVED';

export interface WebSocketConnectAction {
  type: typeof WEBSOCKET_CONNECT;
}

export interface SendMessageAction {
  type: typeof SEND_MESSAGE;
  payload: Message;
}

export interface NewMessageReceivedAction {
  type: typeof NEW_MESSAGE_RECEIVED;
  payload: Message;
}

export type WebSocketActionTypes = WebSocketConnectAction | SendMessageAction | NewMessageReceivedAction;
