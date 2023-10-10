import React, { FC, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';

import classes from './ButtonWithPreviewHintAndLabel.module.scss';

import { Tag } from 'components';

interface EditCommentButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  hint?: ReactNode;
  label?: ReactNode;
}

export const ButtonWithPreviewHintAndLabel: FC<EditCommentButtonProps> = ({
  children,
  className,
  disabled,
  hint,
  label,
  ...restProps
}) => {
  const unavailable = typeof restProps.onClick === 'undefined' || disabled;

  return (
    <button
      className={cn(className, classes.container, {
        [classes.container_disabled]: unavailable,
      })}
      disabled={unavailable}
      {...restProps}>
      <span className={classes.label}>
        <Tag>{label}</Tag>
      </span>

      {hint && <span className={classes.hint}>{hint}</span>}

      <span className={classes.children}>{children}</span>
    </button>
  );
};
