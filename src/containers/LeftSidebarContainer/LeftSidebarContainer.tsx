import React from 'react';
import { Sidebar } from 'components';
import { FileExchangeContainer } from 'containers/FileExchangeContainer';
import { ProfileSettingsFormContainer } from 'containers/ProfileSettingsFormContainer';

export const LeftSidebarContainer = () => {
  return (
    <Sidebar visible={true}>
      <FileExchangeContainer />

      <ProfileSettingsFormContainer />
    </Sidebar>
  );
};
