import ReactDOMServer from 'react-dom/server';
import { PageContext, PageContextServer } from '../types/PageContext';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { PageShell } from './PageShell';
import { theme } from '@packages/theme/dist';

export { getTitle, getDescription, renderWithPageShell, renderNodeToString };

const getTitle = (pageContext: PageContext) => {
  const title = pageContext.data?.title || pageContext.config.title;

  if (typeof title === 'string') return title;
  if (typeof title === 'function') return title(pageContext);

  return 'SaaS Boilerplate and Starter Kit with Node.js and React';
};

const getDescription = (pageContext: PageContext) => {
  const description = pageContext.data?.description || pageContext.config.description;

  if (typeof description === 'string') return description;
  if (typeof description === 'function') return description(pageContext);

  return 'SaaS boilerplate and starter kit with Node.js, TypeScript & React. Includes authentication, subscriptions and CI/CD. Build a SaaS in days instead of months.';
};

const renderWithPageShell = ({ pageContext }: { pageContext: PageContextServer }) => {
  const { Page, data } = pageContext;

  if (!Page) throw new Error(`No Page component was exported from ${pageContext.urlOriginal}`);

  return ReactDOMServer.renderToString(
    <PageShell pageContext={pageContext}>
      <Page {...data} />
    </PageShell>
  );
};

const renderNodeToString = (node: React.ReactNode) =>
  ReactDOMServer.renderToString(
    <React.StrictMode>
      <ChakraProvider theme={theme}>{node}</ChakraProvider>
    </React.StrictMode>
  );
