import { Text, VStack, HStack, Avatar } from '@chakra-ui/react';
import { Message } from '@/types/Message';
import { formatTime } from '@/utils/dates';

interface ChatAreaProps {
  messages: Message[];
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages }) => {
  return (
    <VStack flex='1' w='100%' overflowY='auto' spacing={4} p={4} align='stretch'>
      {messages.map(message => (
        <HStack key={message.ID} align='start' spacing={3}>
          <Avatar src={message.User?.AvatarUrl} size='sm' borderRadius='md' />
          <VStack align='start' spacing={0}>
            <HStack mt={-0.5} mb={0}>
              <Text fontWeight='bold'>{message.User?.Name}</Text>
              <Text fontSize='sm' color='gray.500'>
                {message.CreatedAt && formatTime(message.CreatedAt)}
              </Text>
            </HStack>
            <Text>{message.Content}</Text>
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
};

export default ChatArea;
