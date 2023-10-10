import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';

import { SourceModal } from 'components';
import { useNewSourceModalContainer } from './useNewSourceModalContainer';

interface NewSourceModalContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {}

export const NewSourceModalContainer: FC<NewSourceModalContainerProps> = ({
  className,
  ...restProps
}) => {
  const { closeModal, initialDate, initialSource, onChange, saveSource } =
    useNewSourceModalContainer();

  return (
    <SourceModal
      caption={<FormattedMessage id="modal.caption.new-source" defaultMessage="New Source" />}
      className={className}
      closeModal={closeModal}
      initialDate={initialDate}
      initialSource={initialSource}
      onChange={onChange}
      saveSource={saveSource}
      {...restProps}
    />
  );
};
