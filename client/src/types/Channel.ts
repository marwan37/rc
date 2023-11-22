// src/types/Channel.ts

import { Message } from './Message';

export interface Channel {
  ID: number;
  Name: string;
  Description?: string;
  Messages?: Message[];
  Members?: string[]; // array of user IDs who are members of the channel
}
