import { useCallback } from 'react';
import { sources, useAppDispatch } from 'store';

export const useSources = () => {
  const dispatch = useAppDispatch();

  const saveSource = useCallback(
    (args: Parameters<typeof sources.thunk.saveSource>[0]) => {
      dispatch(sources.thunk.saveSource(args));
    },
    [dispatch],
  );

  const deleteSource = useCallback(
    (sourceId: number) => {
      dispatch(
        sources.thunk.deleteSource({
          sourceId,
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
