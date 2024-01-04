import { Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { SectionHeader } from '../SectionHeader.js';
import { IconBox } from '../IconBox.js';
import { Icon, Icons } from '../../types/Icon';

export type Technology = {
  title: string;
  details: string;
  icon: Icon;
};

export const TechnologiesSection = ({ technologies }: { technologies: Technology[] }) => (
  <Flex flexDirection="column" gap={12}>
    <SectionHeader
      type="h2"
      category="Technologies"
      title="How is it built?"
      description="Learn more about the technologies behind this feature."
    />
    <SimpleGrid gap={8} minChildWidth={300}>
      {technologies.map((technology) => (
        <Flex key={technology.title} gap={4} p={4}>
          <Flex>
            <IconBox icon={Icons[technology.icon]} />
          </Flex>
          <Flex flexDirection="column" gap={2}>
            <Heading size="md">{technology.title}</Heading>
            <Flex flexGrow={1}>
              <Text>{technology.details}</Text>
            </Flex>
          </Flex>
        </Flex>
      ))}
    </SimpleGrid>
  </Flex>
);
