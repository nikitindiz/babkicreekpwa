import { useCallback } from 'react';
import { days, sources, useAppDispatch } from 'store';
import { useSelector } from 'react-redux';

export const useSources = () => {
  const dispatch = useAppDispatch();
  const displayRange = useSelector(days.selectors.displayRange);

  const saveSource = useCallback(
    (args: Parameters<typeof sources.thunk.saveSource>[0]) => {
      dispatch(
        sources.thunk.saveSource({
          ...args,
          onDone: (sourceId) => {
            console.log('source save done');
            dispatch(
              sources.thunk.loadSource({
                sourceId: sourceId,
                reFetch: true,
                onDone: () => {
                  console.log('source load done');
                  console.log('source checking updated days');
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

  const deleteSource = useCallback(
    (sourceId: number) => {
      dispatch(
        sources.thunk.deleteSource({
          sourceId,
          onDone: () => {
            dispatch(days.thunk.checkUpdatesDaysData(displayRange));
          },
        }),
      );
    },
    [dispatch, displayRange],
  );

  return {
    saveSource,
    deleteSource,
  };
};
