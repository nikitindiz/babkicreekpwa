import { useCallback, useMemo, useState } from 'react';
import { buildDate, formatDate } from 'utils';
import { SelectSingleEventHandler } from 'react-day-picker';

interface UseDateEditorContainerArgs {
  date?: string;
  onSelect?: (date: string) => void;
}

export const useDateEditorContainer = ({ date, onSelect }: UseDateEditorContainerArgs) => {
  const [visible, setVisible] = useState(false);

  const selectedDate = useMemo(() => buildDate(date).toDate(), [date]);

  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSelect = useCallback<SelectSingleEventHandler>(
    (day) => {
      if (onSelect) {
        onSelect(formatDate(buildDate(day)));
      }

      hide();
    },
    [hide, onSelect],
  );

  return {
    visible,
    selectedDate,
    show,
    hide,
    handleSelect,
  };
};
