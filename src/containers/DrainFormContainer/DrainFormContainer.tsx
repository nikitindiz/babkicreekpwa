import React, { FC, HTMLAttributes } from 'react';

import { EditBalanceChangeEventForm } from 'components';
import { Drain, DrainScheduleMeta } from 'types';
import { useDrainFormContainer } from './useDrainFormContainer';

interface DrainFormContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

export const DrainFormContainer: FC<DrainFormContainerProps> = ({
  className,
  initialDate,
  initialRepeatable,
  initialRepeatableTabIndex,
  initialSelectedWeekDays,
  initialDrain,
  initialDrainScheduleMetas,
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
    setExpenses,
    setRepeatCycleTab,
    setRepeatable,
  } = useDrainFormContainer({
    initialDate,
    initialRepeatable,
    initialRepeatableTabIndex,
    initialSelectedWeekDays,
    initialDrain,
    initialDrainScheduleMetas,
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
      setCurrencyValue={setExpenses}
      setRepeatCycleTab={setRepeatCycleTab}
      setRepeatable={setRepeatable}
      type="drain"
      {...restProps}
    />
  );
};
