import React, { FC, HTMLAttributes } from 'react';
import cn from 'classnames';

import classes from './EditSettingsForm.module.scss';

interface EditSettingsFormProps extends HTMLAttributes<HTMLDivElement> {}

export const EditSettingsForm: FC<EditSettingsFormProps> = ({ className, ...restProps }) => {
  return <div className={cn(className, classes.container)}>EditSettingsForm</div>;
};
