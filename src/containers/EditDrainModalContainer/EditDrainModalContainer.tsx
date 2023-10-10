import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';

import { DrainModal } from 'components';
import { useEditDrainModalContainer } from './useEditDrainModalContainer';
import { useModals } from 'utils/store/hooks';

interface EditDrainModalContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {}

export const EditDrainModalContainer: FC<EditDrainModalContainerProps> = ({
  className,
  ...restProps
}) => {
  const {
    deleteDrain,
    initialDate,
    initialRepeatable,
    initialRepeatableTabIndex,
    initialSelectedWeekDays,
    initialDrain,
    initialDrainScheduleMetas,
    onChange,
    saveDrain,
    scheduleMetaDataIsLoading,
  } = useEditDrainModalContainer();

  const { hide: closeModal } = useModals();

  if (scheduleMetaDataIsLoading) return null;

  return (
    <DrainModal
      isLoading={scheduleMetaDataIsLoading}
      caption={<FormattedMessage id="modal.caption.edit-drain" defaultMessage="Edit Drain" />}
      className={className}
      closeModal={closeModal}
      deleteDrain={deleteDrain}
      initialDate={initialDate}
      initialRepeatable={initialRepeatable}
      initialRepeatableTabIndex={initialRepeatableTabIndex}
      initialSelectedWeekDays={initialSelectedWeekDays}
      initialDrain={initialDrain}
      initialDrainScheduleMetas={initialDrainScheduleMetas}
      onChange={onChange}
      saveDrain={saveDrain}
      {...restProps}
    />
  );
};
