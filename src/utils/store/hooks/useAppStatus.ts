import { useSelector } from 'react-redux';
import { days, drains, sources, thicknessMap } from 'store';
import { useMemo } from 'react';

export const useAppStatus = () => {
  const daysLoadingStarted = useSelector(days.selectors.loadingStarted);
  const daysLoadingEnded = useSelector(days.selectors.loadingEnded);
  const thicknessMapLoadingStarted = useSelector(thicknessMap.selectors.loadingStarted);
  const thicknessMapLoadingEnded = useSelector(thicknessMap.selectors.loadingEnded);
  const sourcesById = useSelector(sources.selectors.byId);
  const newSource = sourcesById['new'];
  const drainsById = useSelector(drains.selectors.byId);
  const newDrain = drainsById['new'];

  const someSourcesAreLoading = useMemo(() => {
    return Object.values(sourcesById).some(
      (source) => source?.loadingStarted && !source?.loadingEnded,
    );
  }, [sourcesById]);

  const someDrainsAreLoading = useMemo(() => {
    return Object.values(sourcesById).some(
      (source) => source?.loadingStarted && !source?.loadingEnded,
    );
  }, [sourcesById]);

  return {
    daysLoading: daysLoadingStarted && !daysLoadingEnded,
    thicknessMapLoading: thicknessMapLoadingStarted && !thicknessMapLoadingEnded,
    newSourceCreating: newSource?.savingStarted && !newSource?.savingEnded,
    newDrainCreating: newDrain?.savingStarted && !newDrain?.savingEnded,
    someSourcesAreLoading,
    someDrainsAreLoading,
  };
};
