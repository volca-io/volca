import { Flex, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export const IconBox = ({ icon, size = 12 }: { icon: IconType; size?: number }) => (
  <Flex
    w={size}
    h={size}
    justifyContent="center"
    alignItems="center"
    borderRadius={4}
    bgGradient="linear(to-r, gradient.start, gradient.end)"
    backgroundSize="200%"
  >
    <Icon boxSize={6} as={icon} />
  </Flex>
);
