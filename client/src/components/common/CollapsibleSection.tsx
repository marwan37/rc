import { useState } from 'react';
import { Box, Text, IconButton, Flex } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box ml={2} mt={4}>
      <Flex justifyContent='base' alignItems='center' mb={2}>
        <IconButton
          aria-label='Toggle section'
          icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={() => setIsOpen(!isOpen)}
          size='xs'
          mr={1}
        />
        <Text fontSize='md' fontWeight='bold' mt={1}>
          {title}
        </Text>
      </Flex>
      {isOpen && children}
    </Box>
  );
};

export default CollapsibleSection;
