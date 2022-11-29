import React from 'react';
import { Avatar, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { MdPayments, MdAddShoppingCart, MdPerson, MdPayment } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { currentUserState } from '../state';
import { SoftCard } from '../components/generic/SoftCard';
import { PageHeading } from '../components/generic/PageHeading';
import { useSubscriptionActions } from '../hooks';

export const SettingsPage: React.FC = () => {
  const user = useRecoilValue(currentUserState);
  const { manageSubscriptions, activateSubscription } = useSubscriptionActions();

  return (
    <AuthenticatedLayout sidebar={false}>
      <SimpleGrid minChildWidth="200px" width="100%" spacingX="40px" spacingY="20px">
        <SoftCard>
          <PageHeading title="Profile" icon={MdPerson} />
          {user && (
            <Flex justifyContent="flex-start" mt={2} flexDirection="row">
              <Flex>
                <Avatar
                  name={`${user.first_name} ${user.last_name}`}
                  display="block"
                  margin="0 auto"
                  mt={4}
                  size="lg"
                />
                <Flex pl={6} flexDirection="column" wordBreak="break-all">
                  <Text mt={4} noOfLines={1}>
                    {user.email}
                  </Text>
                  <Text>
                    {user.first_name} {user.last_name}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
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
