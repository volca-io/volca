import * as React from 'react';
import {
  IconButton,
  IconButtonProps,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Button,
  AlertDialogFooter,
  Textarea,
} from '@chakra-ui/react';
import { MdCampaign } from 'react-icons/md';
import { useUserActions } from '../../hooks';
import { useForm } from 'react-hook-form';

type FormValues = {
  message: string;
};

type SupportButtonProps = Omit<IconButtonProps, 'aria-label'>;

export const SupportButton: React.FC<SupportButtonProps> = (props) => {
  const { sendSupportMessage } = useUserActions();
  const { register, handleSubmit } = useForm<FormValues>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const onSubmit = async ({ message }: FormValues) => {
    await sendSupportMessage(message);
    onClose();
  };

  return (
    <>
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        aria-label="Request support"
        onClick={onOpen}
        icon={<MdCampaign />}
        {...props}
      />
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Request support
            </AlertDialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogBody>
                <Textarea
                  size={'lg'}
                  placeholder="Send us a message and we'll get back to you as soon as we can."
                  {...register('message', { required: true })}
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme={'blue'} ml={3}>
                  Send
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
