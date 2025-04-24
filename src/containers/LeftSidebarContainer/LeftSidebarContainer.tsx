import React from 'react';
import { Sidebar } from 'components';
import { FileExchangeContainer } from 'containers/FileExchangeContainer';
import { ProfileSettingsFormContainer } from 'containers/ProfileSettingsFormContainer';
import { useNavigation } from 'utils/store/hooks';

export const LeftSidebarContainer = () => {
  const { leftSidebarVisible, hideLeftSidebar } = useNavigation();

  return (
    <Sidebar visible={leftSidebarVisible} onClose={hideLeftSidebar}>
      <FileExchangeContainer />

      <ProfileSettingsFormContainer />
    </Sidebar>
  );
};
