import React, { FC, HTMLAttributes, ReactNode, useEffect } from 'react';
import cn from 'classnames';

import classes from './Sidebar.module.scss';

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  onClose?: () => void;
  width?: string | number;
  children: ReactNode;
  position?: 'left' | 'right';
}

export const Sidebar: FC<SidebarProps> = ({
  className,
  visible,
  onClose,
  width = '300px',
  children,
  position = 'left',
  ...restProps
}) => {
  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  // Close sidebar when clicking outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={cn(classes.overlay, { [classes.overlay_visible]: visible })}
      onClick={handleOverlayClick}>
      <div
        className={cn(
          classes.sidebar,
          classes[`sidebar_${position}`],
          { [classes.sidebar_visible]: visible },
          className,
        )}
        style={{ width }}
        {...restProps}>
        {children}
      </div>
    </div>
  );
};
