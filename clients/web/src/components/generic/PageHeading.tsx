import { Box, Flex, Heading, Icon, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';

const IconCircle = ({ icon }: { icon: any }) => {
  const background = useColorModeValue('gray.200', 'gray.600');
  return (
    <Box
      display="flex"
      borderRadius="50%"
      h="42px"
      w="42px"
      mr="4"
      background={background}
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={icon} boxSize="24px" />
    </Box>
  );
};

export const PageHeading = ({ title, icon }: { title: string; icon: IconType }) => {
  return (
    <Flex alignItems="center">
      <IconCircle icon={icon} />
      <Heading size="md">{title}</Heading>
    </Flex>
  );
};
