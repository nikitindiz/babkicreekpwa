import React, { FC, HTMLAttributes, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { ModalLayout } from 'components';
import { SyncOptionsFormContainer } from 'containers';

interface SyncModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  caption: ReactNode;
  closeModal?: () => void;
  isLoading?: boolean;
}

export const SyncModal: FC<SyncModalProps> = ({
  caption,
  className,
  closeModal,
  isLoading = false,
  ...restProps
}) => {
  return (
    <ModalLayout
      className={className}
      caption={caption}
      footer={
        <>
          <button
            onClick={closeModal}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.2 : 1 }}>
            <FormattedMessage id="modal.button.cancel" defaultMessage="Cancel" />
          </button>
        </>
      }
      {...restProps}>
      <SyncOptionsFormContainer />
    </ModalLayout>
  );
};
