import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';
import cn from 'classnames';

import classes from './NavigationStatusMessage.module.scss';

interface NavigationStatusMessageProps extends HTMLAttributes<HTMLDivElement> {
  daysLoading: any;
  newDrainCreating: any;
  newSourceCreating: any;
  someDrainsAreLoading: boolean;
  someSourcesAreLoading: boolean;
  thicknessMapLoading: any;
}

export const NavigationStatusMessage: FC<NavigationStatusMessageProps> = ({
  className,
  daysLoading,
  newDrainCreating,
  newSourceCreating,
  someDrainsAreLoading,
  someSourcesAreLoading,
  thicknessMapLoading,
  ...restProps
}) => {
  const inProgress = daysLoading || thicknessMapLoading || newSourceCreating || newDrainCreating;

  let message = <FormattedMessage id="navigation.header" defaultMessage="Finances Chart" />;

  if (someSourcesAreLoading) {
    message = <FormattedMessage id="navigation.sources-loading" defaultMessage="Loading sources" />;
  }

  if (someDrainsAreLoading) {
    message = <FormattedMessage id="navigation.drains-loading" defaultMessage="Loading drains" />;
  }

  if (newSourceCreating) {
    message = (
      <FormattedMessage id="navigation.new-source-creating" defaultMessage="Creating new source" />
    );
  }

  if (newDrainCreating) {
    message = (
      <FormattedMessage id="navigation.new-drain-creating" defaultMessage="Creating new drain" />
    );
  }

  if (daysLoading) {
    message = <FormattedMessage id="navigation.days-loading" defaultMessage="Loading days stats" />;
  }

  if (thicknessMapLoading) {
    message = (
      <FormattedMessage
        id="navigation.thickness-map-loading"
        defaultMessage="Calculating chart width"
      />
    );
  }

  return (
    <div
      className={cn(className, classes.container, { [classes.container_inProgress]: inProgress })}>
      {message}
    </div>
  );
};
