import { Box, Flex, Heading, Icon, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';

const IconCircle = ({ icon }: { icon: any }) => {
  return (
    <Box
      display={'flex'}
      borderRadius={'50%'}
      h={'42px'}
      w={'42px'}
      mr={4}
      background={useColorModeValue('gray.200', 'gray.600')}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Icon as={icon} boxSize={'24px'} />
    </Box>
  );
};

export const PageHeading = ({ title, icon }: { title: string; icon: IconType }) => {
  return (
    <Flex alignItems={'center'}>
      <IconCircle icon={icon} />
      <Heading size="md">{title}</Heading>
    </Flex>
  );
};
