import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';

import { SourceModal } from 'components';
import { useEditSourceModalContainer } from './useEditSourceModalContainer';
import { useModals } from 'utils/store/hooks';

interface EditSourceModalContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {}

export const EditSourceModalContainer: FC<EditSourceModalContainerProps> = ({
  className,
  ...restProps
}) => {
  const {
    deleteSource,
    initialDate,
    initialRepeatable,
    initialRepeatableTabIndex,
    initialSelectedWeekDays,
    initialSource,
    initialSourceScheduleMetas,
    onChange,
    saveSource,
    scheduleMetaDataIsLoading,
  } = useEditSourceModalContainer();

  const { hide: closeModal } = useModals();

  if (scheduleMetaDataIsLoading) return null;

  return (
    <SourceModal
      isLoading={scheduleMetaDataIsLoading}
      caption={<FormattedMessage id="modal.caption.edit-source" defaultMessage="Edit Source" />}
      className={className}
      closeModal={closeModal}
      deleteSource={deleteSource}
      initialDate={initialDate}
      initialRepeatable={initialRepeatable}
      initialRepeatableTabIndex={initialRepeatableTabIndex}
      initialSelectedWeekDays={initialSelectedWeekDays}
      initialSource={initialSource}
      initialSourceScheduleMetas={initialSourceScheduleMetas}
      onChange={onChange}
      saveSource={saveSource}
      {...restProps}
    />
  );
};
