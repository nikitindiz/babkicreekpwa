import React, { FC } from 'react';
import { useDrainChartContainer } from 'containers/DrainChartContainer/useDrainChartContainer';
import { DrainChart } from 'components';

interface DrainChartContainerProps {
  balanceIsNegative?: boolean;
  drainId?: number;
}

export const DrainChartContainer: FC<DrainChartContainerProps> = ({
  balanceIsNegative,
  drainId,
}) => {
  const { displayValue, header, openEdit } = useDrainChartContainer({
    drainId,
  });

  if (!displayValue) {
    return null;
  }

  return (
    <DrainChart
      displayValue={displayValue}
      header={header}
      openEdit={openEdit}
      balanceIsNegative={balanceIsNegative}
    />
  );
};
