import { RepeatIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';

type ErrorPageProps = {
  heading?: string;
  description?: string;
  reloadEnabled?: boolean;
};

export const ErrorPage: React.FC<ErrorPageProps> = ({
  heading = 'An unexpected error occurred',
  description = 'Please reload the page and try again',
  reloadEnabled = true,
}: ErrorPageProps) => {
  return (
    <Flex justifyContent="center" minH="100vh">
      <Flex justifyContent="center" alignItems="center" flexDir="column">
        <WarningTwoIcon boxSize={100}></WarningTwoIcon>
        <Heading as="h1" mt={4} textAlign="center">
          {heading}
        </Heading>
        <Text>{description}</Text>
        {reloadEnabled && (
          <Button
            mt={4}
            leftIcon={<RepeatIcon />}
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
