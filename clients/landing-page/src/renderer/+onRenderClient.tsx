import { hydrateRoot } from 'react-dom/client';
import { PageShell } from './PageShell';
import type { PageContextClient } from '../types/PageContext';

const render = async (pageContext: PageContextClient) => {
  const { Page, data } = pageContext;
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');
  const root = document.getElementById('react-root');
  if (!root) throw new Error('DOM element #react-root not found');
  hydrateRoot(
    root,
    <PageShell pageContext={pageContext}>
      <Page {...data} />
    </PageShell>
  );
};

export default render;
