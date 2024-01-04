import { Container, Heading, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';

export type Screenshot = {
  title: string;
  details?: string;
  src: string;
};

export const ScreenshotsSection = ({ screenshots }: { screenshots: Screenshot[] }) => (
  <>
    <Container centerContent>
      <Heading as="h2" fontSize="3xl">
        Screenshots
      </Heading>
    </Container>
    <Tabs variant="soft-rounded">
      <TabList>
        {screenshots.map((screenshot) => (
          <Tab key={screenshot.title}>{screenshot.title}</Tab>
        ))}
      </TabList>
      <TabPanels justifyContent="center">
        {screenshots.map((screenshot) => (
          <TabPanel justifyContent="center" key={screenshot.title}>
            <Image
              borderRadius={6}
              maxWidth={{ lg: 400, sm: '100%' }}
              src={screenshot.src}
              alt={`${screenshot.title} example image`}
            />
            <Text mt={4}>{screenshot.details}</Text>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  </>
);
