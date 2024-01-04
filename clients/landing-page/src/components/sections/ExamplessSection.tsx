import { Container, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

export type Example = {
  title: string;
  details: React.ReactElement | string;
};

export const ExamplesSection = ({ examples }: { examples: Example[] }) => {
  if (!examples.length) return null;

  return (
    <>
      <Container centerContent>
        <Heading as="h2" fontSize="3xl">
          Examples
        </Heading>
      </Container>
      <Tabs variant="soft-rounded">
        <TabList>
          {examples.map((example) => (
            <Tab key={example.title}>{example.title}</Tab>
          ))}
        </TabList>
        <TabPanels justifyContent="center">
          {examples.map((example) => (
            <TabPanel justifyContent="center" key={example.title}>
              {example.details}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};
