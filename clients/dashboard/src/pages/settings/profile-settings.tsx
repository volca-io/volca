import React from 'react';
import { Box, Card, CardBody, Heading, Text, VStack } from '@chakra-ui/react';

import { useAuthContext } from '../../providers';

export const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Profile
      </Heading>
      <Card>
        <CardBody>
          {user && (
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
          )}
        </CardBody>
      </Card>
    </>
  );
};
