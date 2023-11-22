import { useState } from 'react';
import { HStack, Input, Button } from '@chakra-ui/react';
import { User } from '@/types/User';

interface MessageInputProps {
  onSendMessage: (message: string, sender: User) => void;
  currentUser: User;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, currentUser }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSendMessage(message, currentUser);
    setMessage('');
  };

  return (
    <HStack w='100%'>
      <Input
        placeholder='Type a message...'
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button onClick={handleSend}>Send</Button>
    </HStack>
  );
};

export default MessageInput;
