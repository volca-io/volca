import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  HStack,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

import { SoftCard } from '../components/generic/SoftCard';
import { AuthenticatedLayout } from '../layouts';
import { FileUploadForm } from '../components/forms/FileUploadForm';
import { PageHeading } from '../components/generic/PageHeading';
import { MdCloudDownload, MdCloudUpload, MdOpenInNew } from 'react-icons/md';
import { useState } from 'react';
import { Storage } from 'aws-amplify';
import { useAuthContext } from '../providers';

interface FormProps {
  key: string;
  level: 'public' | 'protected' | 'private';
}

export const FilesPage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<FormProps>();
  const { isOpen: isVisible, onClose, onOpen } = useDisclosure();

  const { user } = useAuthContext();

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  };

  return (
    <AuthenticatedLayout>
      <PageHeading title="Files" icon={MdCloudUpload} />
      <VStack spacing={6} align="flex-start">
        {isVisible && uploadedFile && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              File Uploaded!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Use the buttons below to download or view your file
              <HStack mt={2} justifyContent="center" display="flex">
                <Button
                  leftIcon={<MdOpenInNew />}
                  onClick={async () => {
                    const res = await Storage.get(uploadedFile.key, {
                      level: uploadedFile.level,
                      identityId: user?.cognitoIdentityId,
                    });

                    window.open(res, '_blank', 'noreferrer');
                  }}
                >
                  Open in new tab
                </Button>
                <Button
                  leftIcon={<MdCloudDownload />}
                  onClick={async () => {
                    const res = await Storage.get(uploadedFile.key, {
                      level: uploadedFile.level,
                      identityId: user?.cognitoIdentityId,
                      download: true,
                    });

                    downloadBlob(res.Body as Blob, uploadedFile.key);
                  }}
                >
                  Download
                </Button>
              </HStack>
            </AlertDescription>
            <CloseButton alignSelf="flex-end" position="absolute" right={2} top={2} onClick={onClose} />
          </Alert>
        )}
        <SoftCard w="100%">
          <FileUploadForm
            onSubmit={({ key, level }) => {
              setUploadedFile({ key, level });
              onOpen();
            }}
          />
        </SoftCard>
      </VStack>
    </AuthenticatedLayout>
  );
};
