import { User } from '@/types/User';
import { Avatar, List, ListItem } from '@chakra-ui/react';
import CollapsibleSection from '../common/CollapsibleSection';
import { Channel } from '@/types/Channel';
import John from '@assets/images/avatars/john.jpeg';
import Bob from '@assets/images/avatars/bob.jpeg';
import Alice from '@assets/images/avatars/alice.jpeg';
import Sarah from '@assets/images/avatars/sarah.jpeg';

interface DirectMessageListProps {
  channels: Channel[];
  currentChannel?: User;
  setCurrentChannel: (channel: Channel) => void;
}

const avatarMap: Record<string, string> = {
  'DM with Alice': Alice,
  'DM with Bob': Bob,
  'DM with John': John,
  'DM with Sarah': Sarah
};

const DirectMessageList: React.FC<DirectMessageListProps> = ({ channels, currentChannel, setCurrentChannel }) => {
  return (
    <CollapsibleSection title='Direct Messages'>
      <List spacing={2} ml={6}>
        {channels.map(channel => (
          <ListItem
            key={channel.ID}
            onClick={() => setCurrentChannel(channel)}
            cursor='pointer'
            bg={currentChannel && channel.ID === currentChannel.ID ? 'green.100' : 'transparent'}
            borderRadius={6}
            p='0px 4px'
            display='flex'
            alignItems='center'>
            <Avatar src={avatarMap[channel.Name]} size='xs' borderRadius='md' mr={1} />
            <span style={{ marginTop: '2px' }}>{channel.Name.slice(7)}</span>
          </ListItem>
        ))}
      </List>
    </CollapsibleSection>
  );
};

export default DirectMessageList;
