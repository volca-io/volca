import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentUser } from '../state';

interface AuthenticatedRouteProps {
  children: React.ReactElement;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({ children }) => {
  const [user] = useRecoilState(currentUser);
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
