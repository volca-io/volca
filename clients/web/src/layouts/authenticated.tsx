import React from 'react';
import { Alert, AlertIcon, Link, Text, VStack } from '@chakra-ui/react';
import { Footer, Sidebar, MainPanel, MainContent } from '../components/layout';
import { useUserActions } from '../hooks';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, sidebar = true }) => {
  const user = useRecoilValue(currentUserState);
  const { resendVerification } = useUserActions();

  return (
    <>
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
      <Sidebar hidden={!sidebar}>
        <MainPanel>
          <MainContent>
            <VStack align="flex-start">{children}</VStack>
          </MainContent>
          <Footer />
        </MainPanel>
      </Sidebar>
    </>
  );
};
