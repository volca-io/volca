import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state';

interface AuthenticatedRouteProps {
  children: React.ReactElement;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const user = useRecoilValue(currentUserState);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const continueUrl = encodeURIComponent(`${location.pathname + location.search}`);
      return navigate(`/sign-in?continue=${continueUrl}`);
    }
  }, [navigate, location, user]);

  return user && children;
};
