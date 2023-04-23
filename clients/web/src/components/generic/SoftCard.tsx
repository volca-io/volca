import * as React from 'react';
import { Card, useColorModeValue } from '@chakra-ui/react';

export const SoftCard = ({
  children,
  onClick,
  ...rest
}: {
  children?: React.ReactNode;
  onClick?: (...args: any[]) => void;
  [x: string]: any;
}) => {
  const background = useColorModeValue('white', 'gray.900');
  const backgroundHover = useColorModeValue('gray.100', 'gray.800');

  return (
    <Card
      {...rest}
      onClick={onClick}
      _hover={onClick ? { background: backgroundHover } : {}}
      background={background}
      p={{
        base: 4,
        md: 8,
      }}
      boxShadow="lg"
      borderRadius="lg"
    >
      {children}
    </Card>
  );
};
