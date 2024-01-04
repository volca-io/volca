import { PageContext } from '../../../types/PageContext';
import { features } from './data';

const data = async (pageContext: PageContext) => {
  const slug = pageContext.routeParams?.slug;
  const page = features.find((feature) => feature.slug === slug);

  if (!page) {
    throw new Error('Failed to find page with slug ' + slug);
  }

  return {
    slug,
    seoTitle: page.seoTitle,
  };
};

export { data };
