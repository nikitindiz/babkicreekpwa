import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import isMobile from 'is-mobile';
import cn from 'classnames';

import classes from './Layout.module.scss';

import {
  EditDrainModalContainer,
  EditSourceModalContainer,
  LeftSidebarContainer,
  ModalsContainer,
  NewDrainModalContainer,
  SyncModalContainer,
} from 'containers';
import { NewSourceModalContainer } from 'src/containers/NewSourceModalContainer';
import { SettingsModal } from 'components';
import { useIsMobile } from 'utils/hooks/useIsMobile';
import { TodayButton } from 'components/TodayButton/TodayButton';

interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  navigation?: ReactNode;
  scrollToday?: () => void;
}

export const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, navigation, scrollToday, ...restProps }, ref) => {
    const mobile = useIsMobile();

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

        <LeftSidebarContainer />

        <div>
          <TodayButton onClick={scrollToday}>1</TodayButton>
        </div>
      </div>
    );
  },
);

Layout.displayName = 'Layout';
