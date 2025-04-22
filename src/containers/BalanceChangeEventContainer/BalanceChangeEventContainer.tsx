import React, { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { BalanceChangeEvent } from 'components';
import { useSelector } from 'react-redux';
import { days, drains, sources } from 'store';

interface BalanceChangeEventContainerProps extends HTMLAttributes<HTMLDivElement> {
  expensesSection?: ReactNode;
  flowThickness?: number;
  incomesSection?: ReactNode;
  lineStyles?: CSSProperties;
}

export const BalanceChangeEventContainer: React.FC<BalanceChangeEventContainerProps> = (props) => {
  const daysLoadingStarted = useSelector(days.selectors.loadingStarted);
  const daysLoadingEnded = useSelector(days.selectors.loadingEnded);
  const anyDrainIsLoading = useSelector(drains.selectors.isAnyDrainLoading);
  const anyDrainIsSaving = useSelector(drains.selectors.isAnyDrainSaving);
  const anySourceIsLoading = useSelector(sources.selectors.isAnySourcesLoading);
  const anySourceIsSaving = useSelector(sources.selectors.isAnySourceSaving);

  return (
    <BalanceChangeEvent
      {...props}
      isLoading={
        (daysLoadingStarted && !daysLoadingEnded) ||
        anyDrainIsLoading ||
        anyDrainIsSaving ||
        anySourceIsLoading ||
        anySourceIsSaving
      }
    />
  );
};
