import React, { FC, HTMLAttributes } from 'react';

import { Navigation } from 'components';
import { useNavigationContainer } from './useNavigationContainer';

interface NavigationContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const NavigationContainer: FC<NavigationContainerProps> = (props) => {
  const { lockScreen, onSyncClick } = useNavigationContainer();

  return <Navigation {...props} onLockClick={lockScreen} onSyncClick={onSyncClick} />;
};
