import React, { FC } from 'react';
import { useDrainChartContainer } from 'containers/DrainChartContainer/useDrainChartContainer';
import { DrainChart } from 'components';

interface DrainChartContainerProps {
  drainId?: number;
}

export const DrainChartContainer: FC<DrainChartContainerProps> = ({ drainId }) => {
  const { displayValue, header, openEdit } = useDrainChartContainer({
    drainId,
  });

  if (!displayValue) {
    return null;
  }

  return <DrainChart displayValue={displayValue} header={header} openEdit={openEdit} />;
};
