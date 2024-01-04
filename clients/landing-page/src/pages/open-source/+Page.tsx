import { Container, Flex, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { SectionHeader } from '../../components/SectionHeader';
import { CodeBlock } from '../../components/CodeBlock';

const Page = () => (
  <Container maxW="6xl" p={{ base: 4, md: 8 }}>
    <SectionHeader
      category=""
      title="Open Source"
      description="Volca Core is an Open Source Serverless API boilerplate built with Node.js / TypeScript."
    />

    <Flex flexDirection="column" gap={8} my={16}>
      <Heading as="h2" fontSize="2xl">
        Tech Stack
      </Heading>
      <UnorderedList spacing={2}>
        <ListItem>
          <b>Yarn Workspaces</b>: We use Yarn workspaces to create a monorepo structure with multiple apps in one
          repository
        </ListItem>
        <ListItem>
          <b>TypeScript</b>: Type safe Node.js programming with all the benefits from the JavaScript ecosystems
        </ListItem>
        <ListItem>
          <b>Knex</b>: Database management made easy
        </ListItem>
        <ListItem>
          <b>CDK</b>: Deploy AWS infrastructure as code
        </ListItem>
      </UnorderedList>
      <Heading as="h2" fontSize="2xl">
        Serverless API ⚡
      </Heading>
      <Text>
        With a Serverless API you only pay for the time that it takes to execute your API requests. If you have little
        usage, you will most likely stay within the free tier of AWS and run your infrastructure for free.
      </Text>
      <Heading as="h2" fontSize="2xl">
        CI + GitHub Actions = ❤️
      </Heading>
      <Text>
        This project comes with a full CI/CD pipeline that deploys your code, runs tests and scans your code for linting
        errors.
      </Text>
      <Heading as="h2" fontSize="2xl">
        Migrations 🛢️
      </Heading>
      <Text>
        Database migrations help you make gradual changes to your database schema. This boilerplate project contains
        GitHub Actions that automatically run any new migrations as the repository is updated.
      </Text>
      <Heading as="h2" fontSize="2xl">
        Guides
      </Heading>
      <Text>Learn how to use Volca Core to jump start your new project.</Text>
      <Heading as="h3" fontSize="xl">
        Creating an API endpoint
      </Heading>
      <Heading as="h4" fontSize="large">
        1. Create an action
      </Heading>
      <Text>
        An action is essentially the code that runs when you hit an API endpoint. Actions reside in the folder
        services/api/src/actions. Actions typically call services to retrieve or store data and handle the response back
        to the requestor. Add an action by:
      </Text>
      <Text>Creating a file for your action, e.g. services/api/src/actions/my-actions/my-action.ts.</Text>
      <Text>
        Define your action in this file, here you can call services and return various responses depending on what the
        service responds:
      </Text>
      <CodeBlock language="ts">
        {`
import { container } from 'tsyringe';

import { useApiAction } from '../utils/api-action';
import { StatusService } from '../../services';

export const myAction = useApiAction(async () => {
  const statusService = container.resolve(StatusService);
  const status = await statusService.get();

  return {
    body,
  };
});
`}
      </CodeBlock>
      <Heading as="h4" fontSize="large">
        2. Create a route
      </Heading>
      <Text>
        A route is the actual path and the HTTP method that should invoke your action. Routes are defined in
        services/api/src/router.ts. Add a route by:
      </Text>
      <Text>Importing the action in router.ts:</Text>
      <CodeBlock language="ts">{`import { myAction } from './actions/my-actions/my-action';`}</CodeBlock>
      <Text>Defining a new route</Text>
      <CodeBlock language="ts">{`router.get('/status', statusAction); This will enable you to call your action by requesting GET /status.`}</CodeBlock>
    </Flex>
  </Container>
);

export default Page;
