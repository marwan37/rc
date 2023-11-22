import { Action, ThunkAction, configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Channel } from '@/types/Channel';
import { User } from '@/types/User';
import { Message } from '@/types/Message';
import axios from 'axios';

const API_URL = 'http://localhost:3001'

interface AppState {
  channels: Channel[];
  users: User[];
  messages: Message[];
}

const initialState: AppState = {
  channels: [],
  users: [],
  messages: [],
};

// Async actions
export const fetchChannels = createAsyncThunk('channels/fetch', async () => {
  const response = await axios.get(`${API_URL}/channels`);
  return response.data as Channel[];
});

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data as User[];
  } catch (error) {
    console.log(error);
    return [];
  }
});

export const fetchMessagesForChannel = createAsyncThunk('channels/messages/fetch', async (channelId: string) => {
  try {
    const response = await axios.get(`${API_URL}/channels/${channelId}/messages`);
    return response.data as Message[];
  } catch (error) {
    console.log(error);
    return [];
  }
});

export const fetchMessages = createAsyncThunk('messages/fetch', async () => {
  try {
    const response = await axios.get(`${API_URL}/messages`);
    return response.data as Message[];
  } catch (error) {
    console.log(error);
    return [];
  }
});

export const createMessage = createAsyncThunk('messages/create', async (message: Message) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, message);
    return response.data as Message;
  } catch (error: any) {
    return { error: error.message };
  }
});

export const createMessageInChannel = createAsyncThunk('channels/messages/create', async ({ channelId, message }: { channelId: number, message: Message }) => {
  try {
    const response = await axios.post(`${API_URL}/channels/${channelId}/messages`, message);
    return response.data as Message;
  } catch (error: any) {
    return { error: error.message };
  }
});

// Slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      state.channels = action.payload;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
    builder.addCase(createMessage.fulfilled, (state, action) => {
      if ('error' in action.payload) {
        console.log(action.payload.error);
      } else {
        state.messages.push(action.payload);
      }
    });
    builder.addCase(createMessageInChannel.fulfilled, (state, action) => {
      if ('error' in action.payload) {
        console.log(action.payload.error);
      } else {
        state.messages.push(action.payload);
      }
    });
  },
});

// Store
const store = configureStore({
  reducer: appSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
