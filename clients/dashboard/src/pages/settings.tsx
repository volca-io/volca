import React from 'react';
import { Box, Card, CardBody, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';

import { useAuthContext } from '../providers';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <SimpleGrid pt={2} minChildWidth="400px" width="100%" spacingX="40px" spacingY="20px">
      <Box>
        <Heading as="h2" size="md" mb={4}>
          Personal information
        </Heading>
        <Card>
          {user && (
            <CardBody>
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
            </CardBody>
          )}
        </Card>
      </Box>
    </SimpleGrid>
  );
};
