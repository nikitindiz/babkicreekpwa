import React, { FC, HTMLAttributes, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { ModalLayout } from '../ModalLayout';
import { Source, SourceScheduleMeta } from 'types';
import { SourceFormContainer } from 'containers';

interface SourceModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  caption: ReactNode;
  closeModal: () => void;
  deleteSource?: () => void;
  initialDate: string;
  initialRepeatable?: boolean;
  initialRepeatableTabIndex?: number;
  initialSelectedWeekDays?: boolean[];
  initialSource: any;
  initialSourceScheduleMetas?: SourceScheduleMeta[];
  isLoading?: boolean;
  onChange: (args: {
    repeatable: boolean;
    repeatableType: 'monthly' | 'weekly' | null;
    selectedWeekDays: boolean[];
    source: Partial<Omit<Source, 'sourceScheduleMeta'>>;
    newDate?: string;
  }) => void;
  saveSource: () => void;
}

export const SourceModal: FC<SourceModalProps> = ({
  caption,
  className,
  closeModal,
  deleteSource,
  initialDate,
  initialRepeatable,
  initialRepeatableTabIndex,
  initialSelectedWeekDays,
  initialSource,
  initialSourceScheduleMetas,
  isLoading = false,
  onChange,
  saveSource,
  ...restProps
}) => {
  return (
    <ModalLayout
      className={className}
      caption={caption}
      footer={
        <>
          {deleteSource && (
            <button onClick={deleteSource} disabled={isLoading}>
              <FormattedMessage id="modal.button.delete" defaultMessage="Delete" />
            </button>
          )}
          <button onClick={saveSource} disabled={isLoading}>
            <FormattedMessage id="modal.button.save" defaultMessage="Save" />
          </button>
          <button onClick={closeModal} disabled={isLoading}>
            <FormattedMessage id="modal.button.cancel" defaultMessage="Cancel" />
          </button>
        </>
      }
      {...restProps}>
      {!isLoading && (
        <SourceFormContainer
          initialDate={initialDate}
          initialRepeatable={initialRepeatable}
          initialRepeatableTabIndex={initialRepeatableTabIndex}
          initialSelectedWeekDays={initialSelectedWeekDays}
          initialSource={initialSource}
          initialSourceScheduleMetas={initialSourceScheduleMetas}
          onChange={onChange}
        />
      )}
    </ModalLayout>
  );
};
