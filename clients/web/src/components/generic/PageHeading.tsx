import { Box, Flex, Heading, Icon, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';

type PageHeadingProps = {
  title: string;
  size?: string;
  icon?: IconType;
  cta?: React.ReactNode;
};

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

export const PageHeading = ({ title, size = 'md', icon, cta }: PageHeadingProps) => {
  return (
    <Flex justifyContent="space-between" w="full" mb={4}>
      <Flex alignItems="center">
        {icon && <IconCircle icon={icon} />}
        <Heading size={size}>{title}</Heading>
      </Flex>
      {cta}
    </Flex>
  );
};
