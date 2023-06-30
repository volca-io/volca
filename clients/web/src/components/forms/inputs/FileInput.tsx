import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { Storage } from 'aws-amplify';
import { DragEventHandler, useRef, useState } from 'react';
import { MdCloudUpload, MdFileCopy, MdWarning } from 'react-icons/md';
import { v4 as uuid } from 'uuid';

type FileInputProps = {
  description?: string;
  accept?: string;
  level?: 'public' | 'protected' | 'private';
  children?: React.ReactNode;
  onUpload: ({ key }: { key: string }) => void;
};

enum FileUploadState {
  UPLOAD = 'UPLOAD',
  UPLOADING = 'UPLOADING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

const UploadContent = ({ handleClick, description }: { handleClick: () => void | undefined; description?: string }) => (
  <>
    <MdCloudUpload size={30} />
    <Text fontSize="sm" mt={2}>
      <Link onClick={handleClick} color="teal.500" as="b">
        Click to upload
      </Link>{' '}
      or drag and drop
    </Text>
    <Text fontSize="xs">{description}</Text>
  </>
);

const UploadInProgressContent = ({ progress }: { progress: number }) => (
  <>
    <Text fontSize="lg" mt={2}>
      {`${progress}%`}
    </Text>
    <Text fontSize="sm" mt={2}>
      Upoading file..
    </Text>
  </>
);

const UploadCompletedContent = ({
  handleClick,
  fileName,
  onReset,
}: {
  handleClick: () => void | undefined;
  fileName: string;
  onReset: () => void;
}) => (
  <>
    <MdFileCopy size={30} />
    <Text fontSize="md" mt={2}>
      {fileName}
    </Text>
    <Text fontSize="sm" mt={2}>
      <Link onClick={handleClick} color="teal.500" as="b">
        Click to upload a new file
      </Link>{' '}
      or drag and drop
    </Text>
  </>
);

const UploadErrorContent = () => (
  <>
    <MdWarning size={30} />
    <Text fontSize="md" mt={2}>
      Upload failed
    </Text>
    <Text fontSize="sm" mt={2}>
      Failed to upload the file
    </Text>
  </>
);

export const FileInput = ({ accept, description, level, onUpload }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [currentState, setCurrentState] = useState<FileUploadState>(FileUploadState.UPLOAD);
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File | undefined>();
  const [, setError] = useState<string | undefined>();

  const handleClick = () => inputRef.current?.click();

  const uploadFile = async (file: File) => {
    const key = `${uuid()}.${file.name.split('.').pop()}`;
    setFile(file);
    setCurrentState(FileUploadState.UPLOADING);
    setProgress(0);

    const storageAction = Storage.put(key, file, {
      level,
      resumable: true,
      contentType: file.type,
      completeCallback: () => {
        setCurrentState(FileUploadState.COMPLETED);
        onUpload({ key });
      },
      progressCallback: (progress) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        setProgress(percentage);
      },
      errorCallback: (err) => {
        setError('Failed to upload');
        setCurrentState(FileUploadState.ERROR);
      },
    });

    storageAction.resume();
  };

  const onReset = () => {
    setCurrentState(FileUploadState.UPLOAD);
    setProgress(0);
    setError(undefined);
  };

  const handleDrag: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      uploadFile(event.dataTransfer.files[0]);
    }
  };

  const renderContent = () => {
    switch (currentState) {
      case FileUploadState.UPLOAD:
        return <UploadContent handleClick={handleClick} description={description} />;
      case FileUploadState.UPLOADING:
        return <UploadInProgressContent progress={progress} />;
      case FileUploadState.COMPLETED:
        return (
          <UploadCompletedContent handleClick={handleClick} fileName={file?.name || 'Unknown file'} onReset={onReset} />
        );
      case FileUploadState.ERROR:
        return <UploadErrorContent />;
    }
  };

  return (
    <Flex direction="column">
      <Box>
        <input type={'file'} multiple={false} hidden accept={accept} />
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          border="1px"
          boxSizing="border-box"
          borderStyle="solid"
          borderColor="inherit"
          borderRadius="md"
          outline={dragActive ? '2px solid' : undefined}
          padding={4}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {renderContent()}
        </Flex>
      </Box>
    </Flex>
  );
};
