import { useCallback } from 'react';
import { days, sources, useAppDispatch } from 'store';
import { formatDate } from 'utils';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';

export const useSources = () => {
  const dispatch = useAppDispatch();
  const displayRange = useSelector(days.selectors.displayRange);

  const saveSource = useCallback(
    (args: Parameters<typeof sources.thunk.saveSource>[0]) => {
      dispatch(
        sources.thunk.saveSource({
          ...args,
          onDone: () => {
            dispatch(
              days.thunk.checkUpdatesDaysData({
                startDate: displayRange.startDate,
                endDate: displayRange.endDate,
              }),
            );
          },
        }),
      );
    },
    [dispatch, displayRange.endDate],
  );

  const deleteSource = useCallback(
    (sourceId: number) => {
      dispatch(
        sources.thunk.deleteSource({
          sourceId,
          onDone: () => {
            dispatch(
              days.thunk.checkUpdatesDaysData({
                startDate: displayRange.startDate,
                endDate: displayRange.endDate,
              }),
            );
          },
        }),
      );
    },
    [dispatch],
  );

  return {
    saveSource,
    deleteSource,
  };
};
