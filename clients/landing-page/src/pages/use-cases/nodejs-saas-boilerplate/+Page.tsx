import { Container, Flex, Text } from '@chakra-ui/react';
import { SectionHeader } from '../../../components/SectionHeader';
import { FeaturesSection } from '../../../components/sections/FeaturesSection';

const Page = () => (
  <Container maxW="4xl" py={12}>
    <SectionHeader
      title="NodeJS SaaS Boilerplate"
      category="Use Case"
      description="SaaS boilerplate with TypeScript, Koa and Postgres"
    />

    <Flex flexDirection="column" gap={16}>
      <Flex flexDirection="column" gap={4}>
        <Text>
          Volca is a NodeJS SaaS Template written in TypeScript. It comes with pages and components for payments,
          authentication and project management.
        </Text>
        <Text>
          Launch your product quicker by using our SaaS boilerplate instead of spending weeks building the foundation
          for your product yourself. Volca was built using experienced NodeJS developers who has worked from some of the
          top technology startups in Europe.
        </Text>
      </Flex>

      <FeaturesSection />
    </Flex>
  </Container>
);

export default Page;
