import { Channel } from '@/types/Channel';
import { List, ListItem } from '@chakra-ui/react';
import CollapsibleSection from '../common/CollapsibleSection';

interface ChannelListProps {
  channels: Channel[];
  setCurrentChannel: (channel: Channel) => void;
  currentChannel?: Channel;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, setCurrentChannel, currentChannel }) => {
  return (
    <CollapsibleSection title='Channels'>
      <List spacing={2} ml={6}>
        {channels.map(channel => (
          <ListItem
            key={channel.ID}
            cursor='pointer'
            onClick={() => setCurrentChannel(channel)}
            bg={currentChannel && channel.ID === currentChannel.ID ? 'blue.100' : 'transparent'}
            borderRadius={6}
            p='0px 4px'
            display='flex'
            alignItems='center'>
            # {channel.Name}
          </ListItem>
        ))}
      </List>
    </CollapsibleSection>
  );
};

export default ChannelList;
