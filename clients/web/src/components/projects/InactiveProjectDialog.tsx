import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { Project, User } from '../../types';
import { useNavigate } from 'react-router-dom';

export const InactiveProjectDialog = ({
  project,
  user,
  isOpen,
  onClose,
}: {
  project: Project;
  user: User;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const body =
    project.admin_id === user.id
      ? 'This project is not available because you do not have an active subscription. Press the button below to subscribe and gain access to your project.'
      : `This project is not available because the admin does not have an active subscription. Contact the project admin ${project.admin.email} to re-activate their subscription and gain access to the project.`;
  const cancelRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const onSubscribe = () => {
    navigate('/onboarding');
  };

  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Not Available
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              {project.admin_id === user.id && (
                <Button onClick={onSubscribe} mr={4}>
                  Subscribe
                </Button>
              )}
              <Button onClick={onClose}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
