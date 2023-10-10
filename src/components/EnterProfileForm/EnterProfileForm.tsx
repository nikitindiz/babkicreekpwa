import React, { ChangeEvent, FC, FormEvent } from 'react';

import classes from './EnterProfileForm.module.scss';

import { ArrowLeftIcon } from 'components';

interface EnterProfileFormProps {
  dirty: boolean;
  goBack: () => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  password: string;
  handleEnter: (event: FormEvent<HTMLFormElement>) => void;
  profile: { label?: string; hint?: string } | undefined;
}

export const EnterProfileForm: FC<EnterProfileFormProps> = ({
  dirty,
  goBack,
  handleEnter,
  handlePasswordChange,
  password,
  profile,
}) => {
  if (!profile) return <div>Loading...</div>;

  return (
    <form onSubmit={handleEnter}>
      <div className={classes.header}>
        <button type="button" className={classes.backButton} onClick={goBack}>
          <ArrowLeftIcon />
        </button>

        <h2 className={classes.label}>{profile?.label}</h2>
      </div>

      <div className={classes.hint}>{profile?.hint}</div>

      <div className={classes.fields}>
        <div className={classes.fieldLabel}>Profile Key</div>

        <input
          className={classes.password}
          name="profilePassword"
          value={password}
          type="password"
          autoFocus
          onChange={handlePasswordChange}
        />

        <button className={classes.enterButton} type="submit" disabled={!dirty}>
          Enter
        </button>
      </div>
    </form>
  );
};
