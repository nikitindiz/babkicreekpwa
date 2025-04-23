import React, { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { BalanceChangeEvent } from 'components';
import { useSelector } from 'react-redux';
import { days, drains, sources } from 'store';
import { useAppStatus } from 'utils/store/hooks';

interface BalanceChangeEventContainerProps extends HTMLAttributes<HTMLDivElement> {
  expensesSection?: ReactNode;
  flowThickness?: number;
  incomesSection?: ReactNode;
  lineStyles?: CSSProperties;
}

export const BalanceChangeEventContainer: React.FC<BalanceChangeEventContainerProps> = (props) => {
  const {
    daysLoading,
    thicknessMapLoading,
    newSourceCreating,
    newDrainCreating,
    someDrainIsLoading,
    someDrainIsSaving,
    someSourceIsLoading,
    someSourceIsSaving,
    someDrainIsDeleting,
    someSourceIsDeleting,
  } = useAppStatus();

  return (
    <BalanceChangeEvent
      {...props}
      isLoading={
        daysLoading ||
        thicknessMapLoading ||
        newSourceCreating ||
        newDrainCreating ||
        someDrainIsLoading ||
        someDrainIsSaving ||
        someSourceIsLoading ||
        someSourceIsSaving ||
        someDrainIsDeleting ||
        someSourceIsDeleting
      }
    />
  );
};
