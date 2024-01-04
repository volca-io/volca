import { Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { SectionHeader } from '../../components/SectionHeader';
import launchChart from '../../assets/launch-chart.webp';

const Page = () => (
  <Container maxW="6xl" p={{ base: 4, md: 8 }}>
    <SectionHeader
      category="Launch"
      title="Volca Launch"
      description="We help you get your product to production faster than ever using the power of the Volca SaaS boilerplate in combination with +15 years of experience building everything from mission critical enterprise systems to apps for fast growing startups."
    />

    <Flex flexDirection="column" gap={16} my={16}>
      <Flex justifyContent="center">
        <Image src={launchChart} maxW={600} w="100%" />
      </Flex>
      <Flex flexDirection="column" gap={4}>
        <Heading fontSize="2xl" as="h2">
          ⚡ Reduce time to V1
        </Heading>
        <Text>
          By using the Volca SaaS template, you get common components such as authentication, user management, automated
          deployments and much more out of the box. This enables us to reduce the time to get your first version in
          production by months.
        </Text>
      </Flex>

      <Flex flexDirection="column" gap={4}>
        <Heading fontSize="2xl" as="h2">
          💰 No startup cost
        </Heading>
        <Text>
          Hiring senior developers today is hard and always comes with a cost. With Volca Launch, you only pay for the
          time we spend building your product.
        </Text>
      </Flex>

      <Flex flexDirection="column" gap={4}>
        <Heading fontSize="2xl" as="h2">
          🛠️ Minimize technical debt
        </Heading>
        <Text>
          Using a proven tech stack and design patterns, we make sure you get a solid code base that can be extended to
          support hundreds of developers.
        </Text>
      </Flex>

      <Flex flexDirection="column" gap={4}>
        <Heading fontSize="2xl" as="h2">
          👩‍🔬 Long term staffing
        </Heading>
        <Text>
          We help you find, coach and train permanent staff to continue development at a significantly lower burn rate
          after building V1.
        </Text>
      </Flex>

      <Flex flexDirection="column" gap={4}>
        <Heading fontSize="2xl" as="h2">
          🧑‍💻🧑‍💻 Team
        </Heading>
        <Text>
          We help you find, coach and train permanent staff to continue development at a significantly lower burn rate
          after building V1.
        </Text>
      </Flex>
    </Flex>
  </Container>
);

export default Page;
