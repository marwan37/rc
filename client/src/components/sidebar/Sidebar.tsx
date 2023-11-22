import React from 'react';
import ResizablePanel from '@components/common/resizable/ResizablePanel';
import ChannelList from './ChannelList';
import DirectMessageList from './DirectMessageList';
import { Channel } from '@/types/Channel';

interface SidebarProps {
  channels: Channel[];
  setCurrentChannel: (channel: Channel) => void;
  currentChannel?: Channel;
}

const Sidebar: React.FC<SidebarProps> = ({ channels, currentChannel, setCurrentChannel }) => {
  const dmChannels = channels.filter(channel => channel.Name.startsWith('DM') || channel.Name.startsWith('DM'));
  const regularChannels = channels.filter(channel => !channel.Name.startsWith('DM') && !channel.Name.startsWith('DM'));

  return (
    <ResizablePanel>
      <ChannelList channels={regularChannels} setCurrentChannel={setCurrentChannel} currentChannel={currentChannel} />
      <DirectMessageList channels={dmChannels} setCurrentChannel={setCurrentChannel} currentChannel={currentChannel} />
    </ResizablePanel>
  );
};

export default Sidebar;
