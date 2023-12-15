import { Navigate, createSearchParams, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../providers';

export const IsAuthenticatedGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) {
    const search = createSearchParams({
      continue: `${location.pathname + location.search}`,
    }).toString();
    return <Navigate to={`/sign-in?${search}`} />;
  }

  return children;
};
