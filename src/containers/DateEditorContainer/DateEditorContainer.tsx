import React, { FC, ReactNode } from 'react';

import { DateEditor } from 'components';
import { useDateEditorContainer } from './useDateEditorContainer';

interface DateEditorProps {
  children?: ReactNode;
  date?: string;
  onSelect?: (date: string) => void;
}

export const DateEditorContainer: FC<DateEditorProps> = ({ children, date, onSelect }) => {
  const { show, hide, handleSelect, selectedDate, visible } = useDateEditorContainer({
    date,
    onSelect,
  });

  return (
    <DateEditor
      onClick={show}
      handleHide={hide}
      onSelect={handleSelect}
      selectedDate={selectedDate}
      visible={visible}>
      {children}
    </DateEditor>
  );
};
