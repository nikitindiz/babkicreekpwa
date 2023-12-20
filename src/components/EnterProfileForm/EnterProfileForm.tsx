import React, { ChangeEvent, FC, FormEvent, ReactNode } from 'react';

import classes from './EnterProfileForm.module.scss';

import { ArrowLeftIcon } from 'components';

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
}) => {
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
      <div className={classes.fields}>
        <div className={classes.fieldLabel}>Profile password</div>

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

          <span>Stay logged in</span>
        </label>

        {error && <div className={classes.error}>{error}</div>}

        <button className={classes.enterButton} type="submit" disabled={!dirty}>
          Enter
        </button>
      </div>
    </form>
  );
};
