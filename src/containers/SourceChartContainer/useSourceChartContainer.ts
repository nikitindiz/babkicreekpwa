import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ModalsList } from 'types';
import { modals, settings, sourceEditor, sources, useAppDispatch } from 'store';
import { useDayContext } from 'context';

interface UseSourceChartContainerArgs {
  sourceId?: number;
}

export const useSourceChartContainer = ({ sourceId }: UseSourceChartContainerArgs) => {
  const sourcesById = useSelector(sources.selectors.byId);
  const currency = useSelector(settings.selectors.currency);
  const dispatch = useAppDispatch();

  const { date } = useDayContext();

  const openEdit = useCallback(() => {
    dispatch(modals.actions.show(ModalsList.editSource));
    dispatch(sourceEditor.actions.select({ date, sourceId }));
  }, [date, dispatch, sourceId]);

  useEffect(() => {
    if (sourceId && !sourcesById[sourceId]?.data) {
      dispatch(sources.thunk.loadSource({ sourceId: sourceId }));
    }
  }, [dispatch, sourceId, sourcesById]);

  const comment = sourcesById[sourceId!]?.data?.commentary || '';

  const [header] = comment.split('\n');

  const displayValue = sourcesById[sourceId!]?.data?.incomes
    ? `+ ${sourcesById[sourceId!]?.data?.incomes || ''} ${currency}`
    : null;

  return {
    displayValue,
    header,
    openEdit,
  };
};
