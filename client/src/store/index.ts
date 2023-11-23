import { Channel } from '@/types/Channel';
import { Message } from '@/types/Message';
import { User } from '@/types/User';
import { NEW_MESSAGE_RECEIVED, NewMessageReceivedAction } from '@/types/WebSocket';
import createWebSocketMiddleware from '@/utils/websocketMiddleware';
import { Action, ThunkAction, configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import axios from 'axios';
import authReducer from './auth/authReducer';

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

const websocketMiddleware = createWebSocketMiddleware();

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
    builder.addCase(NEW_MESSAGE_RECEIVED, (state, action: NewMessageReceivedAction) => {
      state.messages.push(action.payload);
    });
  },
});

const rootReducer = combineReducers({
  auth: authReducer,
  app: appSlice.reducer
});

// Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
