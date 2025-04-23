import React, { FC, HTMLAttributes } from 'react';
import { FormattedMessage } from 'react-intl';
import cn from 'classnames';

import classes from './NavigationStatusMessage.module.scss';

interface NavigationStatusMessageProps extends HTMLAttributes<HTMLDivElement> {
  daysLoading: any;
  newDrainCreating: any;
  newSourceCreating: any;
  thicknessMapLoading: any;
  someDrainIsLoading?: boolean;
  someDrainIsSaving?: boolean;
  someSourceIsLoading?: boolean;
  someSourceIsSaving?: boolean;
  someDrainIsDeleting?: boolean;
  someSourceIsDeleting?: boolean;
}

export const NavigationStatusMessage: FC<NavigationStatusMessageProps> = ({
  className,
  daysLoading,
  thicknessMapLoading,
  newSourceCreating,
  newDrainCreating,
  someDrainIsLoading,
  someDrainIsSaving,
  someSourceIsLoading,
  someSourceIsSaving,
  someDrainIsDeleting,
  someSourceIsDeleting,
  ...restProps
}) => {
  const inProgress =
    thicknessMapLoading ||
    newSourceCreating ||
    newDrainCreating ||
    someDrainIsLoading ||
    someDrainIsSaving ||
    someSourceIsLoading ||
    someSourceIsSaving ||
    someDrainIsDeleting ||
    someSourceIsDeleting;

  let message = <FormattedMessage id="navigation.header" defaultMessage="Finances Chart" />;

  if (someSourceIsLoading) {
    message = <FormattedMessage id="navigation.sources-loading" defaultMessage="Loading sources" />;
  }

  if (someDrainIsSaving) {
    message = <FormattedMessage id="navigation.drains-saving" defaultMessage="Saving drains" />;
  }

  if (someDrainIsDeleting) {
    message = <FormattedMessage id="navigation.drains-deleting" defaultMessage="Deleting drains" />;
  }

  if (someSourceIsLoading) {
    message = <FormattedMessage id="navigation.sources-loading" defaultMessage="Loading sources" />;
  }

  if (someSourceIsSaving) {
    message = <FormattedMessage id="navigation.sources-saving" defaultMessage="Saving sources" />;
  }

  if (someSourceIsDeleting) {
    message = (
      <FormattedMessage id="navigation.sources-deleting" defaultMessage="Deleting sources" />
    );
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
