import React, { FC, HTMLAttributes, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { ModalLayout } from '../ModalLayout';
import { Drain, DrainScheduleMeta } from 'types';
import { DrainFormContainer } from 'containers';
import { useSelector } from 'react-redux';
import { drainEditor } from 'store';

interface DrainModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  caption: ReactNode;
  closeModal: () => void;
  deleteDrain?: () => void;
  initialDate: string;
  initialRepeatable?: boolean;
  initialRepeatableTabIndex?: number;
  initialSelectedWeekDays?: boolean[];
  initialDrain: any;
  initialDrainScheduleMetas?: DrainScheduleMeta[];
  isLoading?: boolean;
  onChange: (args: {
    repeatable: boolean;
    repeatableType: 'monthly' | 'weekly' | null;
    selectedWeekDays: boolean[];
    drain: Partial<Omit<Drain, 'drainScheduleMeta'>>;
    newDate?: string;
  }) => void;
  saveDrain: () => void;
}

export const DrainModal: FC<DrainModalProps> = ({
  caption,
  className,
  closeModal,
  deleteDrain,
  initialDate,
  initialRepeatable,
  initialRepeatableTabIndex,
  initialSelectedWeekDays,
  initialDrain,
  initialDrainScheduleMetas,
  isLoading = false,
  onChange,
  saveDrain,
  ...restProps
}) => {
  const canSave = useSelector(drainEditor.selectors.canSave);

  return (
    <ModalLayout
      className={className}
      caption={caption}
      footer={
        <>
          {deleteDrain && (
            <button onClick={deleteDrain} disabled={isLoading}>
              <FormattedMessage id="modal.button.delete" defaultMessage="Delete" />
            </button>
          )}
          <button onClick={saveDrain} disabled={isLoading || !canSave}>
            <FormattedMessage id="modal.button.save" defaultMessage="Save" />
          </button>
          <button onClick={closeModal} disabled={isLoading}>
            <FormattedMessage id="modal.button.cancel" defaultMessage="Cancel" />
          </button>
        </>
      }
      {...restProps}>
      {!isLoading && (
        <DrainFormContainer
          initialDate={initialDate}
          initialRepeatable={initialRepeatable}
          initialRepeatableTabIndex={initialRepeatableTabIndex}
          initialSelectedWeekDays={initialSelectedWeekDays}
          initialDrain={initialDrain}
          initialDrainScheduleMetas={initialDrainScheduleMetas}
          onChange={onChange}
        />
      )}
    </ModalLayout>
  );
};
