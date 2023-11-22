import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  Flex,
  Spacer,
  Button,
  VStack,
  HStack,
  Link,
  Divider
} from '@chakra-ui/react';
import { FaRocket, FaComments, FaMobileAlt, FaCloud } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router';

interface FeatureProps {
  title: string;
  text: string;
  icon: IconType;
}

const Feature: React.FC<FeatureProps> = ({ title, text, icon }) => (
  <VStack spacing={3}>
    <Icon as={icon} w={10} h={10} />
    <Heading size='md'>{title}</Heading>
    <Text textAlign='center'>{text}</Text>
  </VStack>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Container maxW='container.xl'>
        <Flex py={5}>
          <Heading as='h1' size='xl'>
            RocketChat
          </Heading>
          <Spacer />
          <HStack spacing={4}>
            <Link href='/about'>About</Link>
            <Link href='/contact'>Contact</Link>
            <Link href='/login'>Login</Link>
            <Button colorScheme='blue'>Sign Up</Button>
          </HStack>
        </Flex>

        <VStack spacing={8} py={10}>
          <Heading as='h2' size='lg' textAlign='center'>
            Welcome to RocketChat
          </Heading>
          <Text fontSize='xl' textAlign='center'>
            The ultimate chat solution for schools, bootcamps, and businesses.
          </Text>
        </VStack>

        <Divider my={10} />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10} py={5}>
          <Feature
            icon={FaRocket}
            title='Fast & Reliable'
            text='Experience lightning-fast communication with cutting-edge technology.'
          />
          <Feature
            icon={FaComments}
            title='Easy Collaboration'
            text='Enhance teamwork with intuitive chat interfaces and features.'
          />
          <Feature
            icon={FaMobileAlt}
            title='Mobile Friendly'
            text='Stay connected on-the-go with our fully responsive design.'
          />
          <Feature
            icon={FaCloud}
            title='Cloud-based'
            text='Access your chats anywhere, anytime with our secure cloud platform.'
          />
        </SimpleGrid>

        <Divider my={10} />

        <Box py={10}>
          <Heading as='h3' size='md' textAlign='center' mb={5}>
            Start using RocketChat today!
          </Heading>
          <Flex justifyContent='center'>
            <Button colorScheme='green' size='lg' onClick={() => navigate('/demo')}>
              Get Started
            </Button>
          </Flex>
        </Box>

        <Box py={5} textAlign='center'>
          <Text>&copy; {new Date().getFullYear()} RocketChat Inc. All rights reserved.</Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
