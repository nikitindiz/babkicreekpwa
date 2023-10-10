import React, { FC, ReactNode } from 'react';

import { SyncOptionsForm } from 'components';

interface SyncOptionsFormContainerProps {
  children?: ReactNode;
}

export const SyncOptionsFormContainer: FC<SyncOptionsFormContainerProps> = ({ children }) => {
  return <SyncOptionsForm />;
};
