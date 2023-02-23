import { Alert, AlertTitle, AlertDescription, AlertIcon, Box, CloseButton, AlertProps } from '@chakra-ui/react';

export type AlertBoxProps = AlertProps & {
  status: 'info' | 'warning' | 'success' | 'error' | 'loading';
  title: string;
  description: string | React.ReactNode;
  onClose?: () => void;
};

export const AlertBox: React.FC<AlertBoxProps> = ({ status, title, description, onClose, ...rest }) => (
  <Alert status={status} mb={5} {...rest}>
    <AlertIcon />
    <Box>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description} </AlertDescription>
    </Box>
    {onClose && <CloseButton alignSelf="flex-start" position="absolute" right={0} top={0} onClick={onClose} />}
  </Alert>
);
