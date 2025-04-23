import React, { FC, ReactNode } from 'react';

import { useAppStatus } from 'utils/store/hooks';
import { NavigationStatusMessage } from 'components';

interface NavigationStatusMessageContainerProps {
  children?: ReactNode;
}

export const NavigationStatusMessageContainer: FC<NavigationStatusMessageContainerProps> = () => {
  const {
    daysLoading,
    thicknessMapLoading,
    newSourceCreating,
    newDrainCreating,
    someDrainIsLoading,
    someDrainIsSaving,
    someSourceIsLoading,
    someSourceIsSaving,
    someDrainIsDeleting,
    someSourceIsDeleting,
  } = useAppStatus();

  return (
    <NavigationStatusMessage
      daysLoading={daysLoading}
      newDrainCreating={newDrainCreating}
      newSourceCreating={newSourceCreating}
      thicknessMapLoading={thicknessMapLoading}
      someDrainIsLoading={someDrainIsLoading}
      someDrainIsSaving={someDrainIsSaving}
      someSourceIsLoading={someSourceIsLoading}
      someSourceIsSaving={someSourceIsSaving}
      someDrainIsDeleting={someDrainIsDeleting}
      someSourceIsDeleting={someSourceIsDeleting}
    />
  );
};
