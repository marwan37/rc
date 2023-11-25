// src/store/websocketTypes.ts

import { Message } from './Message';
import { User } from './User';

export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const NEW_MESSAGE_RECEIVED = 'NEW_MESSAGE_RECEIVED';

export interface WebSocketConnectAction {
  type: typeof WEBSOCKET_CONNECT;
  payload: {
    channelId: number;
  };
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


export interface WebSocketMessage {
  ID: string,
  CreatedAt: string,
  UpdatedAt: string,
  Content: string,
  UserID: number,
  ChannelID: number,
  User: User
}
