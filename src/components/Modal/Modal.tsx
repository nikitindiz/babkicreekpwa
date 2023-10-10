import React, { FC, MouseEventHandler, ReactNode, useCallback, useRef } from 'react';
import cn from 'classnames';

import classes from './Modal.module.scss';

interface ModalProps {
  children?: ReactNode;
  onBackdropClick?: MouseEventHandler<HTMLDivElement>;
  visible?: boolean;
}

export const Modal: FC<ModalProps> = ({ children, visible = false, onBackdropClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleClickBackdrop = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      const { target } = event;
      if (target === backdropRef.current && onBackdropClick) onBackdropClick(event);
    },
    [onBackdropClick],
  );

  if (!visible) return null;

  return (
    <div ref={backdropRef} className={cn(classes.background)} onClick={handleClickBackdrop}>
      <div className={cn(classes.window)} ref={containerRef}>
        {children}
      </div>
    </div>
  );
};
