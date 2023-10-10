import React, { FC, HTMLAttributes } from 'react';

import { EditBalanceChangeEventForm } from 'components';
import { Source, SourceScheduleMeta } from 'types';
import { useSourceFormContainer } from './useSourceFormContainer';

interface SourceFormContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export const SourceFormContainer: FC<SourceFormContainerProps> = ({
  className,
  initialDate,
  initialRepeatable,
  initialRepeatableTabIndex,
  initialSelectedWeekDays,
  initialSource,
  initialSourceScheduleMetas,
  onChange,
  ...restProps
}) => {
  const {
    changeDateTab,
    changeRepeatable,
    commentary,
    currencyValue,
    date,
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
  } = useSourceFormContainer({
    initialDate,
    initialRepeatable,
    initialRepeatableTabIndex,
    initialSelectedWeekDays,
    initialSource,
    initialSourceScheduleMetas,
    onChange,
  });

  return (
    <EditBalanceChangeEventForm
      changeDateTab={changeDateTab}
      changeRepeatable={changeRepeatable}
      commentary={commentary}
      currencyValue={currencyValue}
      date={date}
      initialDateTab={initialDateTab}
      onWeekDayCheckboxChange={onWeekDayCheckboxChange}
      repeatCycleTab={repeatCycleTab}
      repeatable={repeatable}
      selectedWeekDays={selectedWeekDays}
      setCommentary={setCommentary}
      setDate={setDate}
      setCurrencyValue={setIncomes}
      setRepeatCycleTab={setRepeatCycleTab}
      setRepeatable={setRepeatable}
      type="source"
      {...restProps}
    />
  );
};
