import { useSelector } from 'react-redux';
import { days, drains, sources, thicknessMap } from 'store';

export const useAppStatus = () => {
  const daysLoadingStarted = useSelector(days.selectors.loadingStarted);
  const daysLoadingEnded = useSelector(days.selectors.loadingEnded);
  const thicknessMapLoadingStarted = useSelector(thicknessMap.selectors.loadingStarted);
  const thicknessMapLoadingEnded = useSelector(thicknessMap.selectors.loadingEnded);
  const sourcesById = useSelector(sources.selectors.byId);
  const newSource = sourcesById['new'];
  const drainsById = useSelector(drains.selectors.byId);
  const newDrain = drainsById['new'];
  const someDrainIsLoading = useSelector(drains.selectors.isAnyDrainLoading);
  const someDrainIsSaving = useSelector(drains.selectors.isAnyDrainSaving);
  const someSourceIsLoading = useSelector(sources.selectors.isAnySourcesLoading);
  const someSourceIsSaving = useSelector(sources.selectors.isAnySourceSaving);
  const someSourceIsDeleting = useSelector(sources.selectors.isAnySourceDeleting);
  const someDrainIsDeleting = useSelector(drains.selectors.isAnyDrainDeleting);

  return {
    daysLoading: daysLoadingStarted && !daysLoadingEnded,
    thicknessMapLoading: thicknessMapLoadingStarted && !thicknessMapLoadingEnded,
    newSourceCreating: newSource?.savingStarted && !newSource?.savingEnded,
    newDrainCreating: newDrain?.savingStarted && !newDrain?.savingEnded,
    someDrainIsLoading,
    someDrainIsSaving,
    someSourceIsLoading,
    someSourceIsSaving,
    someSourceIsDeleting,
    someDrainIsDeleting,
  };
};
