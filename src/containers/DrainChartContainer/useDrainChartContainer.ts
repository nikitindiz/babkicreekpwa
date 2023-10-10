import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ModalsList } from 'types';
import { modals, settings, drainEditor, drains, useAppDispatch } from 'store';
import { useDayContext } from 'context';

interface UseDrainChartContainerArgs {
  drainId?: number;
}

export const useDrainChartContainer = ({ drainId }: UseDrainChartContainerArgs) => {
  const drainsById = useSelector(drains.selectors.byId);
  const currency = useSelector(settings.selectors.currency);
  const dispatch = useAppDispatch();

  const { date } = useDayContext();

  const openEdit = useCallback(() => {
    dispatch(modals.actions.show(ModalsList.editDrain));
    dispatch(drainEditor.actions.select({ date, drainId }));
  }, [date, dispatch, drainId]);

  useEffect(() => {
    if (drainId && !drainsById[drainId]?.data) {
      dispatch(drains.thunk.loadDrain({ drainId: drainId }));
    }
  }, [dispatch, drainId, drainsById]);

  const comment = drainsById[drainId!]?.data?.commentary || '';

  const [header] = comment.split('\n');

  const displayValue = `- ${drainsById[drainId!]?.data?.expenses || ''} ${currency}`;

  return {
    displayValue,
    header,
    openEdit,
  };
};
