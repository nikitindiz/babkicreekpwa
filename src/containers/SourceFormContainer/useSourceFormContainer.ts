import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

import { buildDate, formatDate } from 'utils';
import { Source, SourceScheduleMeta } from 'types';

interface UseEditSourceFormContainerArgs {
  initialDate?: string;
  initialRepeatable?: boolean;
  initialRepeatableTabIndex?: number;
  initialSelectedWeekDays?: boolean[];
  initialSource?: Source;
  initialSourceScheduleMetas?: SourceScheduleMeta[];
  onChange?: (args: {
    repeatable: boolean;
    repeatableType: 'monthly' | 'weekly' | null;
    selectedWeekDays: boolean[];
    source: Partial<Omit<Source, 'sourceScheduleMeta'>>;
    newDate?: string;
  }) => void;
}

export const useSourceFormContainer = ({
  initialDate,
  initialRepeatable = false,
  initialRepeatableTabIndex = 0,
  initialSelectedWeekDays = [false, false, false, false, false, false, false],
  initialSource,
  onChange,
}: UseEditSourceFormContainerArgs) => {
  const [repeatable, setRepeatable] = useState(initialRepeatable);

  const [date, setDate] = useState(initialDate);

  const [repeatCycleTab, setRepeatCycleTab] = useState(initialRepeatableTabIndex);

  const [commentary, setCommentary] = useState(initialSource?.commentary || '');

  const [incomes, setIncomes] = useState(initialSource?.incomes || 0);

  const [selectedWeekDays, setSelectedWeekDays] = useState(initialSelectedWeekDays);

  const onWeekDayCheckboxChange = useCallback(
    (index: number, value: boolean) => {
      const updatedWeekDays = [...selectedWeekDays];
      updatedWeekDays[index] = value;
      setSelectedWeekDays(updatedWeekDays);
    },
    [selectedWeekDays],
  );

  const changeRepeatable: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setRepeatable(target.checked);
  };

  const initialDateTab = date ? 1 : 0;

  const changeDateTab = useCallback((index: number) => {
    if (index === 0) {
      setDate(formatDate(buildDate()));
    }
  }, []);

  const updatedSource = useMemo(() => ({ commentary, incomes }), [commentary, incomes]);

  useEffect(() => {
    onChange?.({
      source: updatedSource,
      repeatable,
      repeatableType: repeatCycleTab === 0 ? 'monthly' : 'weekly',
      selectedWeekDays,
      newDate: date,
    });
  }, [date, onChange, repeatCycleTab, repeatable, selectedWeekDays, updatedSource]);

  return {
    changeDateTab,
    changeRepeatable,
    commentary,
    date,
    currencyValue: incomes,
    initialDateTab,
    onWeekDayCheckboxChange,
    repeatCycleTab,
    repeatable,
    selectedWeekDays,
    setCommentary,
    setDate,
    setIncomes,
    setRepeatCycleTab,
    setRepeatable,
  };
};
