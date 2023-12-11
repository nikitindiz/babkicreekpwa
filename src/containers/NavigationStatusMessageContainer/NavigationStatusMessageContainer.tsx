import React, { FC, ReactNode } from 'react';

import { useAppStatus } from 'utils/store/hooks';
import { NavigationStatusMessage } from 'components';

interface NavigationStatusMessageContainerProps {
  children?: ReactNode;
}

export const NavigationStatusMessageContainer: FC<NavigationStatusMessageContainerProps> = () => {
  const {
    daysLoading,
    newDrainCreating,
    newSourceCreating,
    someDrainsAreLoading,
    someSourcesAreLoading,
    thicknessMapLoading,
  } = useAppStatus();

  return (
    <NavigationStatusMessage
      daysLoading={daysLoading}
      newDrainCreating={newDrainCreating}
      newSourceCreating={newSourceCreating}
      someDrainsAreLoading={someDrainsAreLoading}
      someSourcesAreLoading={someSourcesAreLoading}
      thicknessMapLoading={thicknessMapLoading}
    />
  );
};
