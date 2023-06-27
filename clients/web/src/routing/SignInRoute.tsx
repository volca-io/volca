import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../providers';

interface AuthenticatedRouteProps {
  children: React.ReactElement;
}

export const SignInRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      const continueParam = searchParams.get('continue');
      const continueTo = continueParam || '/';

      return navigate(continueTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return children;
};
