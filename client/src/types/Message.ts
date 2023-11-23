// src/types/Message.ts

import { User } from './User';

export interface Message {
  ID: number;
  Content: string;
  CreatedAt?: Date;
  ChannelID: number;
  UserID: number;
  User?: User;
}
