import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';

import { buildDate, formatDate } from 'utils';
import { Drain, DrainScheduleMeta } from 'types';
import { useDispatch, useSelector } from 'react-redux';
import { drainEditor } from 'store';

interface UseEditDrainFormContainerArgs {
  initialDate?: string;
  initialRepeatable?: boolean;
  initialRepeatableTabIndex?: number;
  initialSelectedWeekDays?: boolean[];
  initialDrain?: Drain;
  initialDrainScheduleMetas?: DrainScheduleMeta[];
  onChange?: (args: {
    repeatable: boolean;
    repeatableType: 'monthly' | 'weekly' | null;
    selectedWeekDays: boolean[];
    drain: Partial<Omit<Drain, 'drainScheduleMeta'>>;
    newDate?: string;
  }) => void;
}

export const useDrainFormContainer = ({
  initialDate,
  initialRepeatable = false,
  initialRepeatableTabIndex = 0,
  initialSelectedWeekDays = [false, false, false, false, false, false, false],
  initialDrain,
  onChange,
}: UseEditDrainFormContainerArgs) => {
  const dispatch = useDispatch();
  const canSave = useSelector(drainEditor.selectors.canSave);

  const [repeatable, setRepeatable] = useState(initialRepeatable);

  const [date, setDate] = useState(initialDate);

  const [repeatCycleTab, setRepeatCycleTab] = useState(initialRepeatableTabIndex);

  const [commentary, setCommentary] = useState(initialDrain?.commentary || '');

  const [expenses, setExpenses] = useState(initialDrain?.expenses || null);

  useEffect(() => {
    if (!expenses && canSave) {
      dispatch(drainEditor.actions.disableSave());
    }

    if (expenses && !canSave) {
      dispatch(drainEditor.actions.enableSave());
    }
  }, [canSave, dispatch, expenses]);

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

  const updatedDrain = useMemo(
    () => ({ commentary, expenses: expenses || 0 }),
    [commentary, expenses],
  );

  useEffect(() => {
    onChange?.({
      drain: updatedDrain,
      repeatable,
      repeatableType: repeatCycleTab === 0 ? 'monthly' : 'weekly',
      selectedWeekDays,
      newDate: date,
    });
  }, [date, onChange, repeatCycleTab, repeatable, selectedWeekDays, updatedDrain]);

  return {
    changeDateTab,
    changeRepeatable,
    commentary,
    date,
    currencyValue: expenses,
    initialDateTab,
    onWeekDayCheckboxChange,
    repeatCycleTab,
    repeatable,
    selectedWeekDays,
    setCommentary,
    setDate,
    setExpenses,
    setRepeatCycleTab,
    setRepeatable,
  };
};
