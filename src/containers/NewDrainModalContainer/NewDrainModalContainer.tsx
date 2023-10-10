import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';

import { DrainModal } from 'components';
import { useNewDrainModalContainer } from './useNewDrainModalContainer';

interface NewDrainModalContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {}

export const NewDrainModalContainer: FC<NewDrainModalContainerProps> = ({
  className,
  ...restProps
}) => {
  const { closeModal, initialDate, initialDrain, onChange, saveDrain } =
    useNewDrainModalContainer();

  return (
    <DrainModal
      caption={<FormattedMessage id="modal.caption.new-drain" defaultMessage="New Drain" />}
      className={className}
      closeModal={closeModal}
      initialDate={initialDate}
      initialDrain={initialDrain}
      onChange={onChange}
      saveDrain={saveDrain}
      {...restProps}
    />
  );
};
