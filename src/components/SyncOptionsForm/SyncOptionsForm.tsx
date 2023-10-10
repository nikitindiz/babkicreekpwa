import React, { FC, ReactNode } from 'react';
import { FileExchangeContainer } from 'containers';

interface SyncOptionsFormProps {
  children?: ReactNode;
}

export const SyncOptionsForm: FC<SyncOptionsFormProps> = ({ children }) => {
  return (
    <div>
      <FileExchangeContainer />
    </div>
  );
};
