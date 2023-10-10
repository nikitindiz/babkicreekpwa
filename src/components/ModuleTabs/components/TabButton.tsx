import React, { FC, HTMLAttributes, useCallback } from 'react';

interface TabButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  onClick: (tabIndex: number) => void;
  index: number;
}

export const TabButton: FC<TabButtonProps> = ({ onClick, index, ...restProps }) => {
  const onClickHandler = useCallback(() => {
    onClick(index);
  }, [index, onClick]);

  return <button onClick={onClickHandler} {...restProps} />;
};
