import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import isMobile from 'is-mobile';
import cn from 'classnames';

import classes from './Layout.module.scss';

import {
  EditDrainModalContainer,
  EditSourceModalContainer,
  ModalsContainer,
  NewDrainModalContainer,
  SyncModalContainer,
} from 'containers';
import { NewSourceModalContainer } from 'src/containers/NewSourceModalContainer';
import { SettingsModal } from 'components';

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  navigation?: ReactNode;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, navigation, ...restProps }, ref) => {
    const mobile = isMobile();

    return (
      <div
        ref={ref}
        className={cn(classes.container, { [classes.container_mobile]: mobile })}
        {...restProps}>
        <div className={cn(classes.chart, { [classes.chart_mobile]: mobile })}>{children}</div>

        <div className={cn(classes.navigation)}>{navigation}</div>

        <ModalsContainer
          editDrainNode={<EditDrainModalContainer />}
          editSourceNode={<EditSourceModalContainer />}
          newDrainNode={<NewDrainModalContainer />}
          newSourceNode={<NewSourceModalContainer />}
          settingsNode={<SettingsModal />}
          syncOptionsNode={<SyncModalContainer />}
        />
      </div>
    );
  },
);

Layout.displayName = 'Layout';
