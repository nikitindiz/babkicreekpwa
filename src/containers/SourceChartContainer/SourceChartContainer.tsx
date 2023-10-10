import React, { FC } from 'react';
import { useSourceChartContainer } from 'containers/SourceChartContainer/useSourceChartContainer';
import { SourceChart } from 'components';

interface SourceChartContainerProps {
  sourceId?: number;
}

export const SourceChartContainer: FC<SourceChartContainerProps> = ({ sourceId }) => {
  const { displayValue, header, openEdit } = useSourceChartContainer({
    sourceId,
  });
  return <SourceChart displayValue={displayValue} header={header} openEdit={openEdit} />;
};
