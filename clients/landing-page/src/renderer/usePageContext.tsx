import React, { useContext } from 'react';
import type { PageContext } from '../types/PageContext';

const Context = React.createContext<PageContext>(undefined as unknown as PageContext);

export const PageContextProvider = ({
  pageContext,
  children,
}: {
  pageContext: PageContext;
  children: React.ReactNode;
}) => {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePageContext = () => {
  const pageContext = useContext(Context);
  return pageContext;
};
