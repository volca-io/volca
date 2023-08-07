import React from 'react';
import { Box, Button, Flex, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { MdAddShoppingCart, MdPerson, MdOutlineOpenInNew } from 'react-icons/md';

import { AuthenticatedLayout } from '../layouts';
import { SoftCard } from '../components/generic/SoftCard';
import { PageHeading } from '../components/generic/PageHeading';
import { useSubscriptionActions } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../providers';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthContext();
  const { manageSubscriptions } = useSubscriptionActions();
  const navigate = useNavigate();

  return (
    <AuthenticatedLayout sidebar={false}>
      <PageHeading title="Profile" icon={MdPerson} />

      <SimpleGrid pt={2} minChildWidth="400px" width="100%" spacingX="40px" spacingY="20px">
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Personal information
          </Heading>
          <SoftCard>
            {user && (
              <>
                <VStack spacing={4} alignItems="flex-start">
                  <Box>
                    <Text fontWeight={700}>Name</Text>
                    <Text size="md">
                      {user.firstName} {user.lastName}
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
        </Box>
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Billing
          </Heading>
          <SoftCard>
            <Flex justifyContent="space-between" alignItems="center">
              <Box>
                <Heading as="h3" size="sm" mb={2}>
                  Manage subscription
                </Heading>
                <Text>View, edit or cancel your subscription</Text>
              </Box>

              {user?.hasActiveSubscription ? (
                <Button rightIcon={<MdAddShoppingCart />} onClick={manageSubscriptions}>
                  Manage
                </Button>
              ) : (
                <Button leftIcon={<MdOutlineOpenInNew />} onClick={() => navigate('/onboarding')}>
                  Subscribe
                </Button>
              )}
            </Flex>
          </SoftCard>
        </Box>
      </SimpleGrid>
    </AuthenticatedLayout>
  );
};
