import React, { FC, ReactNode } from 'react';

import { Modal } from 'components';
import { ModalsList } from 'types';

interface ModalsProps {
  current: ModalsList;
  editDrainNode: ReactNode;
  editSourceNode: ReactNode;
  hide: () => void;
  newDrainNode: ReactNode;
  newSourceNode: ReactNode;
  settingsNode: ReactNode;
  syncOptionsNode: ReactNode;
}

export const Modals: FC<ModalsProps> = ({
  current,
  editDrainNode,
  editSourceNode,
  hide,
  newDrainNode,
  newSourceNode,
  settingsNode,
  syncOptionsNode,
}) => {
  return (
    <Modal visible={current !== ModalsList.none} onBackdropClick={hide}>
      {current === ModalsList.syncOptions && syncOptionsNode}

      {current === ModalsList.newSource && newSourceNode}

      {current === ModalsList.editSource && editSourceNode}

      {current === ModalsList.newDrain && newDrainNode}

      {current === ModalsList.editDrain && editDrainNode}

      {current === ModalsList.settings && settingsNode}
    </Modal>
  );
};
