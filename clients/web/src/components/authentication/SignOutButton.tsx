import { MenuItem } from '@chakra-ui/react';
import React from 'react';
import { useAuthContext } from '../../providers';

interface SignOutButtonProps {
  children: React.ReactNode;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ children }) => {
  const { signOut } = useAuthContext();
  
  return <MenuItem onClick={signOut}>{children}</MenuItem>;
};
