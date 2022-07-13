import React from 'react';
import { Button, Heading, Text } from '@chakra-ui/react';
import { MdPayments } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { currentUser } from '../state';

export const SettingsPage: React.FC = () => {
  const user = useRecoilValue(currentUser);

  const manageSubscriptions = async () => {
    try {
      const { url } = await ApiClient.createStripeBillingPortalSession();
      window.location.replace(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticatedLayout>
      <>
        <Heading>Settings</Heading>
        {user && (
          <>
            <Text>{user.email}</Text>
            <Text>{user.first_name}</Text>
            <Text>{user.last_name}</Text>
            <Button colorScheme={'blue'} rightIcon={<MdPayments />} onClick={manageSubscriptions}>
              Manage Subscriptions
            </Button>
          </>
        )}
      </>
    </AuthenticatedLayout>
  );
};
