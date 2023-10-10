import React, { FC, ReactNode } from 'react';
import { useModals } from 'utils/store/hooks';
import { Modals } from 'components';

interface ModalsContainerProps {
  editDrainNode: ReactNode;
  editSourceNode: ReactNode;
  newDrainNode: ReactNode;
  newSourceNode: ReactNode;
  settingsNode: ReactNode;
  syncOptionsNode: ReactNode;
}

export const ModalsContainer: FC<ModalsContainerProps> = ({
  editDrainNode,
  editSourceNode,
  newDrainNode,
  newSourceNode,
  settingsNode,
  syncOptionsNode,
}) => {
  const { hide, current } = useModals();

  return (
    <Modals
      current={current}
      editDrainNode={editDrainNode}
      editSourceNode={editSourceNode}
      hide={hide}
      newDrainNode={newDrainNode}
      newSourceNode={newSourceNode}
      settingsNode={settingsNode}
      syncOptionsNode={syncOptionsNode}
    />
  );
};
