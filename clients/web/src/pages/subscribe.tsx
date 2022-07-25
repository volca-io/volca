import React from 'react';
import {
  Heading,
  Button,
  Text,
  Box,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react';
import { MdVpnKey, MdPayments, MdBusinessCenter, MdLock, MdChevronRight, MdOutbound } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { ApiClient } from '../lib/clients/api-client';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUser } from '../state';

export const SubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const user = useRecoilValue(currentUser);

  const onActivate = async () => {
    try {
      const session = await ApiClient.createStripeSession();
      window.location.replace(session.url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthenticatedLayout sidebar={false}>
      <Heading>{user?.free_trial_activated ? 'Subscribe' : 'Activate Free Trial'}</Heading>
      {searchParams.get('status') === 'warning' && (
        <Alert status={'warning'}>
          <AlertIcon />
          <AlertTitle>Payment failed</AlertTitle>
          <AlertDescription>Something went wrong while processing your payment. Please try again.</AlertDescription>
        </Alert>
      )}
      <Text>
        {user?.free_trial_activated
          ? 'Subscribe to start using Volca.'
          : 'Activate the 7-day free trial to start using Volca.'}
      </Text>
      <Box>
        <List>
          <ListItem>
            <ListIcon as={MdVpnKey} />
            <b>Authentication</b> - Secure and reliable authentication out of the box
          </ListItem>
          <ListItem>
            <ListIcon as={MdPayments} />
            <b>Subscriptions</b> - Enable your users to subscribe to your service
          </ListItem>
          <ListItem>
            <ListIcon as={MdBusinessCenter} />
            <b>Projects</b> - Enable your users to create projects to manage your features
          </ListItem>
          <ListItem>
            <ListIcon as={MdLock} />
            <b>Secure</b> - Built with best practice security
          </ListItem>
        </List>
      </Box>

      {!user?.free_trial_activated && (
        <Box>
          <List paddingTop={'1em'} paddingBottom={'1em'}>
            <ListItem>
              <ListIcon as={MdChevronRight} />
              After the free trial is over you will be charged $10 / month.
            </ListItem>
            <ListItem>
              <ListIcon as={MdChevronRight} />
              If you cancel your subscription before the free trial is over, you will not be charged.
            </ListItem>
            <ListItem>
              <ListIcon as={MdChevronRight} />
              You can cancel your subscription at any time.{' '}
            </ListItem>
          </List>
        </Box>
      )}

      <Button rightIcon={<MdOutbound />} colorScheme={'blue'} onClick={onActivate} type="submit" marginTop="1em">
        {user?.free_trial_activated ? 'Subscribe' : 'Activate!'}
      </Button>
    </AuthenticatedLayout>
  );
};
