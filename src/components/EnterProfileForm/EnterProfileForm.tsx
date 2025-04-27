import React, { ChangeEvent, FC, FormEvent, ReactNode, useState, useEffect } from 'react';

import classes from './EnterProfileForm.module.scss';

import { ArrowLeftIcon } from 'components';
import { FormattedMessage } from 'react-intl';

interface EnterProfileFormProps {
  dirty: boolean;
  error?: ReactNode;
  goBack: () => void;
  handleEnter: (event: FormEvent<HTMLFormElement>) => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRememberProfileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  password: string;
  profile: { label?: string; hint?: string } | undefined;
  rememberProfile?: boolean;
  retry?: () => void;
}

export const EnterProfileForm: FC<EnterProfileFormProps> = ({
  dirty,
  error,
  goBack,
  handleEnter,
  handlePasswordChange,
  handleRememberProfileChange,
  password,
  profile,
  rememberProfile = false,
  retry,
}) => {
  const [retryCountdown, setRetryCountdown] = useState(error ? 20 : 0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (error) {
      // Start with 20 seconds when error occurs
      setRetryCountdown(20);

      timer = setInterval(() => {
        setRetryCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } else {
      setRetryCountdown(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [error]);

  if (!profile) return <div>Loading...</div>;

  return (
    <form onSubmit={handleEnter} className={classes.container}>
      <div className={classes.header}>
        <button type="button" className={classes.backButton} onClick={goBack}>
          <ArrowLeftIcon />
        </button>

        <h2 className={classes.label}>{profile?.label}</h2>
      </div>

      <div className={classes.hint}>{profile?.hint}</div>

      {error && (
        <div>
          <div className={classes.error}>
            <FormattedMessage
              id="enterProfile.error"
              defaultMessage="Sorry, but the password you have entered is wrong"
            />

            <br />
            <br />

            <button
              className={classes.retryButton}
              type="button"
              onClick={retry}
              disabled={retryCountdown > 0}>
              {retryCountdown > 0 ? (
                <FormattedMessage
                  id="enterProfile.retryWithCountdown"
                  defaultMessage="Retry ({seconds}s)"
                  values={{ seconds: retryCountdown }}
                />
              ) : (
                <FormattedMessage id="enterProfile.retry" defaultMessage="Retry" />
              )}
            </button>
          </div>
        </div>
      )}

      {!error && (
        <div className={classes.fields}>
          <div className={classes.fieldLabel}>
            <FormattedMessage id="enterProfile.password" defaultMessage="Profile password" />
          </div>
          <input
            className={classes.password}
            name="profilePassword"
            value={password}
            type="password"
            autoFocus
            onChange={handlePasswordChange}
          />

          <label className={classes.rememberProfile}>
            <input
              type="checkbox"
              className={classes.rememberProfileCheckBox}
              onChange={handleRememberProfileChange}
              checked={rememberProfile}
            />

            <span>
              <FormattedMessage
                id="enterProfile.enterAutomatically"
                defaultMessage="Stay signed in"
              />
            </span>
          </label>

          <button className={classes.enterButton} type="submit" disabled={!dirty}>
            <FormattedMessage id="enterProfile.enter" defaultMessage="Enter profile" />
          </button>
        </div>
      )}
    </form>
  );
};
