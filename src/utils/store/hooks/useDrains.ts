import { useCallback } from 'react';
import { days, drains, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';

export const useDrains = () => {
  const dispatch = useAppDispatch();
  const displayRange = useSelector(days.selectors.displayRange);

  const saveDrain = useCallback(
    (args: Parameters<typeof drains.thunk.saveDrain>[0]) => {
      dispatch(
        drains.thunk.saveDrain({
          ...args,
          onDone: (drainId) => {
            dispatch(
              drains.thunk.loadDrain({
                drainId: drainId,
                reFetch: true,
                onDone: () => {
                  dispatch(days.thunk.checkUpdatesDaysData(displayRange));
                },
              }),
            );
          },
        }),
      );
    },
    [dispatch, displayRange],
  );

  const deleteDrain = useCallback(
    (drainId: number) => {
      dispatch(
        drains.thunk.deleteDrain({
          drainId,
          onDone: () => {
            dispatch(days.thunk.checkUpdatesDaysData(displayRange));
          },
        }),
      );
    },
    [dispatch, displayRange],
  );

  return {
    saveDrain,
    deleteDrain,
  };
};
