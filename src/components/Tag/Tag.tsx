import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './Tag.module.scss';

interface TagProps extends HTMLAttributes<HTMLDivElement> {}

export const Tag: FC<TagProps> = ({ className, children, ...restProps }) => {
  return (
    <div className={cn(className, classes.container)} {...restProps}>
      {children}
    </div>
  );
};
