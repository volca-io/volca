import { RepeatIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { DefaultLayout } from '../layouts';

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
    <DefaultLayout displayLogo displayLoadingBar={false}>
      <Flex height="100vh" justifyContent="center">
        <Flex justifyContent="center" alignItems="center" flexDir="column">
          <WarningTwoIcon boxSize={100}></WarningTwoIcon>
          <Heading as="h1" mt={4}>
            {heading}
          </Heading>
          <Text>{description}</Text>
          {reloadEnabled && (
            <Button
              mt={4}
              variant="outline"
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
    </DefaultLayout>
  );
};
