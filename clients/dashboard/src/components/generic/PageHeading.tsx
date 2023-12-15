import { Flex, Heading } from '@chakra-ui/react';

type PageHeadingProps = {
  title: string;
  size?: string;
};

export const PageHeading = ({ title, size = 'md' }: PageHeadingProps) => {
  return (
    <Flex alignItems="center">
      <Heading size={size}>{title}</Heading>
    </Flex>
  );
};
