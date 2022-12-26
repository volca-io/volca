import React from 'react';
import { Alert, AlertIcon, Flex, Link, Text, VStack } from '@chakra-ui/react';
import { Footer, Sidebar, MainPanel, MainContent } from '../components/layout';
import { useUserActions } from '../hooks';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state';
import { LoadingBar } from '../components/generic/LoadingBar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, sidebar = true }) => {
  const user = useRecoilValue(currentUserState);
  const { resendVerification } = useUserActions();

  return (
    <Flex flexDir="column" minH="100vh">
      {user && !user.verified_at && (
        <Alert status="warning">
          <AlertIcon />
          <Text>
            Your account is not verified. Please verify your account by using the link you received after sign up. Did
            not get the email? Click{' '}
            <Link fontWeight={600} onClick={async () => await resendVerification()}>
              here
            </Link>{' '}
            to resend.
          </Text>
        </Alert>
      )}
      <Sidebar mt={user && !user.verified_at ? '48px' : '0'} hidden={!sidebar} />
      <LoadingBar full={!sidebar} />
      <MainPanel clearSidebar={sidebar}>
        <MainContent>
          <VStack align="flex-start">{children}</VStack>
        </MainContent>
        <Footer />
      </MainPanel>
    </Flex>
  );
};
