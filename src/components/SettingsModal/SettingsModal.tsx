import React, { FC, HTMLAttributes } from 'react';

import { EditSettingsForm, ModalLayout } from '..';

interface SettingsModalProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsModal: FC<SettingsModalProps> = ({ className, ...restProps }) => {
  return (
    <ModalLayout
      className={className}
      caption="Settings"
      children={<EditSettingsForm />}
      footer={
        <>
          <button>Save</button>
          <button>Cancel</button>
        </>
      }
    />
  );
};
