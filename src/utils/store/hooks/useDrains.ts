import { useCallback } from 'react';
import { drains, useAppDispatch } from 'store';

export const useDrains = () => {
  const dispatch = useAppDispatch();

  const saveDrain = useCallback(
    (args: Parameters<typeof drains.thunk.saveDrain>[0]) => {
      dispatch(drains.thunk.saveDrain(args));
    },
    [dispatch],
  );

  const deleteDrain = useCallback(
    (drainId: number) => {
      dispatch(
        drains.thunk.deleteDrain({
          drainId,
        }),
      );
    },
    [dispatch],
  );

  return {
    saveDrain,
    deleteDrain,
  };
};
