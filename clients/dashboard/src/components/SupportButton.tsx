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
  useToast,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { MdContactSupport } from 'react-icons/md/index.js';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useApiClient } from '../hooks';

type FormValues = {
  message: string;
};

type SupportButtonProps = Omit<IconButtonProps, 'aria-label'>;

export const SupportButton: React.FC<SupportButtonProps> = (props) => {
  const { register, handleSubmit } = useForm<FormValues>();
  const { client } = useApiClient();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const { mutate } = useMutation({
    mutationFn: ({ message }: { message: string }) => client.post('communications/support', { json: { message } }),
    onSuccess: () => {
      toast({ status: 'success', title: 'Your message has been sent!' });
      onClose();
    },
    onError: () => {
      toast({ status: 'error', title: 'Failed to send message' });
    },
  });

  const onSubmit = async ({ message }: FormValues) => {
    mutate({ message });
  };

  return (
    <>
      <Tooltip label="Send a support message">
        <IconButton
          variant="ghost"
          fontSize="xl"
          aria-label="Request support"
          onClick={onOpen}
          icon={<MdContactSupport />}
          {...props}
        />
      </Tooltip>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Request support</AlertDialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AlertDialogBody>
                <Textarea
                  placeholder="Send us a message and we'll get back to you as soon as we can."
                  {...register('message', { required: true })}
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <HStack gap={4}>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Send</Button>
                </HStack>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
