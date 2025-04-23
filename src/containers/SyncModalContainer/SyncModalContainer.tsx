import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';

import { SyncModal } from 'components';
import { useSyncModalContainer } from './useSyncModalContainer';

interface NewSyncModalContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {}

export const SyncModalContainer: FC<NewSyncModalContainerProps> = ({ className, ...restProps }) => {
  const { closeModal, loading } = useSyncModalContainer();

  return (
    <SyncModal
      caption={<FormattedMessage id="modal.caption.sync-modal" defaultMessage="Sync options" />}
      className={className}
      closeModal={!loading ? closeModal : undefined}
      isLoading={loading}
      {...restProps}
    />
  );
};
