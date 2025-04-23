import React from 'react';
import { Sidebar } from 'components';
import { FileExchangeContainer } from 'containers/FileExchangeContainer';

export const LeftSidebarContainer = () => {
  return (
    <Sidebar visible={true}>
      <FileExchangeContainer />
    </Sidebar>
  );
};
