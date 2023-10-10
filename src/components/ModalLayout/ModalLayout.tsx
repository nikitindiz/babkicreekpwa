import React, { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './ModalLayout.module.scss';

interface ModalLayoutProps extends HTMLAttributes<HTMLDivElement> {
  caption?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

export const ModalLayout: FC<ModalLayoutProps> = ({
  caption,
  children,
  className,
  footer,
  ...restProps
}) => {
  return (
    <div className={cn(className, classes.container)} {...restProps}>
      <div className={cn(classes.header)}>{caption}</div>

      <div className={cn(classes.content, { [classes.content_noFooter]: !footer })}>{children}</div>

      {footer && <div className={cn(classes.footer)}>{footer}</div>}
    </div>
  );
};
