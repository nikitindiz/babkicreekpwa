import { Sidebar } from 'components';
import { FileExchangeContainer } from 'containers/FileExchangeContainer';
import { ProfileSettingsFormContainer } from 'containers/ProfileSettingsFormContainer';
import { FC } from 'react';

interface LeftSidebarProps {
  visible: boolean;
  onClose?: () => void;
}

export const LeftSidebar: FC<LeftSidebarProps> = ({ visible, onClose }) => {
  return (
    <Sidebar visible={visible} onClose={onClose}>
      <ProfileSettingsFormContainer />
      <hr />
      <FileExchangeContainer />
    </Sidebar>
  );
};
