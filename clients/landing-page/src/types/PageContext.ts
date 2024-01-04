export type {
  PageContextServer,
  PageContextClientWithServerRouting as PageContextClient,
  PageContextWithServerRouting as PageContext,
} from 'vike/types';
export type { Data };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vike {
    interface PageContext {
      Page: Page;
      data?: Data<Record<string, unknown>>;
      urlPathname: string;
      config: {
        title: string | ((pageContext: PageContext) => string) | undefined;
        description: string | ((pageContext: PageContext) => string) | undefined;
      };
    }
  }
}

type Page = (data: Data<Record<string, unknown>>) => React.ReactElement;
type Data<T> = T;
