import React, { FC, ReactNode } from 'react';
import { FileExchange } from 'components';
import { useFileExchangeContainer } from './useFileExchangeContainer';

interface FileExchangeContainerProps {
  children?: ReactNode;
}

export const FileExchangeContainer: FC<FileExchangeContainerProps> = ({ children }) => {
  const { uploadValidationError, inProgress, inputRef, handleFileChange, clickImport, exportFile } =
    useFileExchangeContainer();

  return (
    <FileExchange
      uploadValidationError={uploadValidationError}
      inProgress={inProgress}
      inputRef={inputRef}
      handleFileChange={handleFileChange}
      clickImport={clickImport}
      exportFile={exportFile}
    />
  );
};
