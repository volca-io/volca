import { Container, Flex } from '@chakra-ui/react';
import { FaqSection } from '../../../components/sections/FaqSection';
import { SectionHeader } from '../../../components/SectionHeader';
import { ScreenshotsSection } from '../../../components/sections/ScreenshotsSection';
import { TechnologiesSection } from '../../../components/sections/TechnologiesSection';
import { ExamplesSection } from '../../../components/sections/ExamplessSection';
import { features } from './data';
import { useData } from '../../../renderer/useData';

export const Page = () => {
  const { slug } = useData<{ slug: string }>();
  const page = features.find((feature) => feature.slug === slug);

  if (!page) {
    throw new Error('Failed to find page with slug ' + slug);
  }

  return (
    <Container maxW="4xl">
      <Flex flexDirection="column" gap={12}>
        <Flex flexDirection="column" gap={4}>
          <SectionHeader category="Feature" title={page.title} description={page.subtitle} />
        </Flex>

        <TechnologiesSection technologies={page.technologies} />
        <ScreenshotsSection screenshots={page.screenshots} />
        <ExamplesSection examples={page.examples} />
        <FaqSection faqs={page.faqs} />
      </Flex>
    </Container>
  );
};
