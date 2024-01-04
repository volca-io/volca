import { Avatar, Button, Card, CardBody, CardFooter, Flex, Heading, Link, Text } from '@chakra-ui/react';
import { MdMail } from 'react-icons/md/index.js';

export const ContactCard = ({
  firstName,
  lastName,
  role,
  email,
  avatar
}: {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  avatar?: string
}) => (
  <Card minW={300} minH={350} >
    <CardBody>
      <Flex justifyContent="center">
        <Avatar size="lg" src={avatar} />
      </Flex>
      <Flex flexDirection="column" mt={4} alignItems="center">
        <Heading>
          {firstName} {lastName}
        </Heading>
        <Text fontSize="lg">{role}</Text>
      </Flex>
    </CardBody>
    <CardFooter>
      <Flex justifyContent="center" alignItems="center" flexGrow={1}>
        <Button leftIcon={<MdMail />} as={Link} href={`mailto:${email}`}>
          Contact {firstName}
        </Button>
      </Flex>
    </CardFooter>
  </Card>
);
