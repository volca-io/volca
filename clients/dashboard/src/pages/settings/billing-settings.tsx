import React from 'react';
import { Box, Button, Card, CardBody, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { MdAddShoppingCart, MdOutlineOpenInNew } from 'react-icons/md/index.js';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../providers';
import { useApiActions } from '../../hooks';
import { useMutation } from '@tanstack/react-query';

type CreateStripeSessionResponse = {
  stripeBillingPortalSession: {
    url: string;
  };
};
export const BillingSettingsPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { createApiAction } = useApiActions();
  const toast = useToast();

  const { mutate } = useMutation({
    mutationFn: () =>
      createApiAction(({ client }) =>
        client.post('stripe/billing-portal-sessions').json<CreateStripeSessionResponse>()
      ),
    onSuccess: (data) => {
      window.open(data?.stripeBillingPortalSession.url, '_blank');
    },
    onError: () => {
      toast({ status: 'error', title: 'Failed to open billing portal' });
    },
  });

  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Billing
      </Heading>
      <Card>
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Heading as="h3" size="sm" mb={2}>
                Manage subscription
              </Heading>
              <Text>View, edit or cancel your subscription</Text>
            </Box>

            {user?.hasActiveSubscription ? (
              <Button
                rightIcon={<MdAddShoppingCart />}
                onClick={() => {
                  mutate();
                }}
              >
                Manage
              </Button>
            ) : (
              <Button leftIcon={<MdOutlineOpenInNew />} onClick={() => navigate('/onboarding')}>
                Manage
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
