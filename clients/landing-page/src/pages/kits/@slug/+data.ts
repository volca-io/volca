import { PageContext } from '../../../types/PageContext';
import { kits } from './data';

const data = async (pageContext: PageContext) => {
  const slug = pageContext.routeParams?.slug;
  const page = kits.find((kit) => kit.slug === slug);

  if (!page) {
    throw new Error('Failed to find page with slug ' + slug);
  }

  return {
    slug,
    title: page.title,
  };
};

export { data };
