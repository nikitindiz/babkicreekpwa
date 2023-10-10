import React, { FC, MouseEventHandler, ReactNode } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';

import { DateSelectModal, ButtonWithPreviewHintAndLabel } from 'components';
import { FormattedMessage } from 'react-intl';

interface DateEditorProps {
  children?: ReactNode;
  handleHide: () => void;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onSelect: SelectSingleEventHandler;
  selectedDate: Date;
  visible: boolean;
}

export const DateEditor: FC<DateEditorProps> = ({
  children,
  handleHide,
  onClick,
  onSelect,
  selectedDate,
  visible,
}) => {
  return (
    <>
      <ButtonWithPreviewHintAndLabel
        label={<FormattedMessage id="balance-change-event.date.label" defaultMessage="Date" />}
        onClick={onClick}>
        {children}
      </ButtonWithPreviewHintAndLabel>
      <DateSelectModal
        handleHide={handleHide}
        onSelect={onSelect}
        selectedDate={selectedDate}
        visible={visible}
      />
    </>
  );
};
