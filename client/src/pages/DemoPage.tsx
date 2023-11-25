import ChatArea from '@/components/chat/ChatArea';
import MessageInput from '@/components/chat/MessageInput';
import Sidebar from '@/components/sidebar/Sidebar';
import { Message } from '@/types/Message';
import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Channel } from '../types/Channel';
import { User } from '../types/User';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, fetchChannels, fetchUsers, fetchMessages } from '@/store';
import { defaultUser } from '@/utils/constants';
import { SEND_MESSAGE, WEBSOCKET_CONNECT } from '@/types/WebSocket';

const DemoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const channels = useSelector((state: RootState) => state.app.channels);
  const messages = useSelector((state: RootState) => state.app.messages);
  const [currentChannel, setCurrentChannel] = useState<Channel | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchUsers());
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    if (currentChannel) {
      dispatch({
        type: WEBSOCKET_CONNECT,
        payload: { channelId: currentChannel.ID }
      });
    }
  }, [dispatch, currentChannel?.ID]);

  useEffect(() => {
    if (channels.length > 0 && !currentChannel) {
      setCurrentChannel(channels[0]);
    }
  }, [channels, currentChannel]);

  const handleSendMessage = (newMessageContent: string, sender: User) => {
    if (!currentChannel) return;
    if (newMessageContent.trim() !== '') {
      const newMessage: Omit<Message, 'ID'> = {
        Content: newMessageContent,
        ChannelID: currentChannel.ID,
        UserID: sender.ID
      };
      dispatch({ type: SEND_MESSAGE, payload: newMessage as Message });
    }
  };

  return (
    <Flex h='100vh'>
      <Sidebar channels={channels} setCurrentChannel={setCurrentChannel} currentChannel={currentChannel} />
      <Flex flex='1' flexDirection='column' p={3}>
        {currentChannel && (
          <>
            <ChatArea messages={messages.filter(msg => msg.ChannelID === currentChannel?.ID)} />
            <MessageInput onSendMessage={handleSendMessage} currentUser={defaultUser} />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default DemoPage;
