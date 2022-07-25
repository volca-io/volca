import React, { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { MdWarning } from 'react-icons/md';
import { Project, User } from '../../types';
import { useNavigate } from 'react-router-dom';

export const ProjectInactiveSubscriptionDialog = ({ project, user }: { project: Project; user: User }) => {
  const body = `This project is not available because it does not have an active subscription. ${
    project.admin_id === user.id
      ? 'Press the button below to subscribe and gain access to your project.'
      : `Contact the project admin ${project.admin.email} to re-activate the subscription.`
  }`;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const onSubscribe = () => {
    navigate('/subscribe');
  };

  return (
    <>
      <Button w={'100%'} colorScheme="orange" rightIcon={<MdWarning />} onClick={onOpen}>
        Not Available
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Not Available
            </AlertDialogHeader>

            <AlertDialogBody>{body}</AlertDialogBody>

            <AlertDialogFooter>
              {project.admin_id === user.id && (
                <Button colorScheme="blue" onClick={onSubscribe} mr={4}>
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
