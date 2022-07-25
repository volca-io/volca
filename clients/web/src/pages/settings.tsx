import React from 'react';
import { Avatar, Button, Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { MdPayments, MdAddShoppingCart, MdPerson, MdPayment } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { currentUser } from '../state';
import { SoftCard } from '../components/generic/SoftCard';
import { PageHeading } from '../components/generic/PageHeading';

export const SettingsPage: React.FC = () => {
  const user = useRecoilValue(currentUser);

  const onActivate = async () => {
    try {
      const session = await ApiClient.createStripeSession();
      window.location.replace(session.url);
    } catch (error) {
      console.error(error);
    }
  };

  const onManageSubscriptions = async () => {
    try {
      const { url } = await ApiClient.createStripeBillingPortalSession();
      window.location.replace(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticatedLayout sidebar={false}>
      <Grid w="100%" templateColumns="repeat(3, 1fr)" gap={4}>
        <GridItem>
          <SoftCard>
            <PageHeading title="Profile" icon={MdPerson} />
            {user && (
              <Flex justifyContent="flex-start" mt={2}>
                <Flex>
                  <Avatar
                    name={`${user.first_name} ${user.last_name}`}
                    display="block"
                    margin="0 auto"
                    mt={4}
                    size="lg"
                  />
                </Flex>
                <Flex pl={6} flexDirection="column" justifyContent="center">
                  <Text mt={4}>{user.email}</Text>
                  <Text>
                    {user.first_name} {user.last_name}
                  </Text>
                </Flex>
              </Flex>
            )}
          </SoftCard>
        </GridItem>
        <GridItem alignItems="stretch">
          <SoftCard>
            <PageHeading title="Subscriptions" icon={MdPayment} />
            {!user?.has_active_subscription && (
              <Button mt={6} colorScheme="blue" rightIcon={<MdAddShoppingCart />} onClick={onActivate}>
                Activate Subscription
              </Button>
            )}
            <Button mt={6} colorScheme="blue" rightIcon={<MdPayments />} onClick={onManageSubscriptions}>
              Manage Subscription
            </Button>
          </SoftCard>
        </GridItem>
      </Grid>
    </AuthenticatedLayout>
  );
};
