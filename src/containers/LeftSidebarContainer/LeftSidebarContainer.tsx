import { LeftSidebar } from 'components';
import { useNavigation } from 'utils/store/hooks';

export const LeftSidebarContainer = () => {
  const { leftSidebarVisible, hideLeftSidebar } = useNavigation();

  return <LeftSidebar visible={leftSidebarVisible} onClose={hideLeftSidebar} />;
};
