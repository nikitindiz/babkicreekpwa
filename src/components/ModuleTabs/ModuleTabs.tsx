import React, { FC, HTMLAttributes, ReactNode, useCallback, useState } from 'react';
import cn from 'classnames';

import classes from './ModuleTabs.module.scss';

import { TabButton } from './components';

interface ModuleTabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'onChange' | 'children'> {
  captions: ReactNode[];
  content?: ReactNode[];
  initialTabSelected?: number;
  onChange?: (tabIndex: number) => void;
}

export const ModuleTabs: FC<ModuleTabsProps> = ({
  className,
  captions = [],
  content = [],
  initialTabSelected = 0,
  onChange,
  ...restProps
}) => {
  const [selected, setSelected] = useState(initialTabSelected);

  const onTabClick = useCallback(
    (index: number) => {
      setSelected(index);
      if (onChange) onChange(index);
    },
    [onChange],
  );

  return (
    <div className={cn(className, classes.container)} {...restProps}>
      <div className={cn(classes.tabs)}>
        {captions.map((item, idx) => (
          <TabButton
            className={cn(classes.singleTab, { [classes.singleTab_active]: idx === selected })}
            index={idx}
            key={idx}
            onClick={onTabClick}>
            {item}
          </TabButton>
        ))}
      </div>
      <div className={cn(classes.content)}>{content[selected]}</div>
    </div>
  );
};
