import { useCallback, useState } from 'react';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';

import { Day, ModalsList } from 'types';
import { drainEditor, modals, sourceEditor, thicknessMap, useAppDispatch } from 'store';

interface UseDayChartContainerArgs {
  day: Day;
}

export const useDayChartContainer = ({ day }: UseDayChartContainerArgs) => {
  const thicknessMapByDate = useSelector(thicknessMap.selectors.byDate);
  const [addButtonsVisible, setAddButtonsVisible] = useState(false);

  const dispatch = useAppDispatch();

  const openAddSource = useCallback(() => {
    dispatch(modals.actions.show(ModalsList.newSource));
    dispatch(sourceEditor.actions.select({ date: day.date, sourceId: 'new' }));
  }, [day.date, dispatch]);

  const openAddDrain = useCallback(() => {
    dispatch(modals.actions.show(ModalsList.newDrain));
    dispatch(drainEditor.actions.select({ date: day.date, drainId: 'new' }));
  }, [day.date, dispatch]);

  const noSourcesOrDrains = !day.sources.length && !day.drains.length;

  const isoDate = moment.unix(day.date).toISOString();

  const onMouseEnter = () => {
    setAddButtonsVisible(true);
  };

  const onMouseLeave = () => {
    setAddButtonsVisible(false);
  };

  return {
    addButtonsVisible,
    isoDate,
    noSourcesOrDrains,
    onMouseEnter,
    onMouseLeave,
    openAddDrain,
    openAddSource,
    thicknessMapByDate,
  };
};
