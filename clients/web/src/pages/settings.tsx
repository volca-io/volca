import React from 'react';
import { Alert, AlertIcon, Box, Button, Link, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { MdPayments, MdAddShoppingCart, MdPerson, MdPayment } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { currentUserState } from '../state';
import { SoftCard } from '../components/generic/SoftCard';
import { PageHeading } from '../components/generic/PageHeading';
import { useSubscriptionActions, useUserActions } from '../hooks';

export const SettingsPage: React.FC = () => {
  const user = useRecoilValue(currentUserState);
  const { manageSubscriptions, activateSubscription } = useSubscriptionActions();
  const { resendVerification } = useUserActions();

  return (
    <AuthenticatedLayout sidebar={false}>
      <SimpleGrid minChildWidth="200px" width="100%" spacingX="40px" spacingY="20px">
        <SoftCard>
          <PageHeading title="Profile" icon={MdPerson} />
          {user && (
            <>
              <VStack pt={6} spacing={4} alignItems="flex-start">
                {!user.verified_at && (
                  <Alert status="warning">
                    <AlertIcon />
                    <Text>
                      Your account is not verified. Please verify your account by using the link you received after sign
                      up. Did not get the email? Click{' '}
                      <Link fontWeight={600} onClick={async () => await resendVerification()}>
                        here
                      </Link>{' '}
                      to resend.
                    </Text>
                  </Alert>
                )}
                <Box>
                  <Text fontWeight={700}>Name</Text>
                  <Text size="md">
                    {user.first_name} {user.last_name}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight={700}>Email</Text>
                  <Text noOfLines={2}>{user.email}</Text>
                </Box>
              </VStack>
            </>
          )}
        </SoftCard>
        <SoftCard>
          <PageHeading title="Subscriptions" icon={MdPayment} />
          {!user?.has_active_subscription && (
            <Button mt={6} colorScheme="blue" rightIcon={<MdAddShoppingCart />} onClick={activateSubscription}>
              Activate Subscription
            </Button>
          )}
          <Button mt={6} colorScheme="blue" rightIcon={<MdPayments />} onClick={manageSubscriptions}>
            Manage Subscription
          </Button>
        </SoftCard>
      </SimpleGrid>
    </AuthenticatedLayout>
  );
};
