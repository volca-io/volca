import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../providers/user-provider';

interface AuthenticatedRouteProps {
  children: React.ReactElement;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const continueUrl = encodeURIComponent(`${location.pathname + location.search}`);
      navigate(`/sign-in?continue=${continueUrl}`);
    }
  }, [navigate, location, user]);

  return children;
};
