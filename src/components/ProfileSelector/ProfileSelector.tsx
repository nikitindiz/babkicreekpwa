import React, { FC } from 'react';

import classes from './ProfileSelector.module.scss';

import { Profile } from 'types';

interface ProfileSelectorProps {
  goToPassword: (id: number) => void;
  profiles: Array<Omit<Profile, 'id'> & { id?: number }> | undefined;
}

export const ProfileSelector: FC<ProfileSelectorProps> = ({ goToPassword, profiles }) => {
  if (!profiles) return <div>Loading...</div>;

  return (
    <div className={classes.container}>
      <h2 className={classes.header}>Select Profile:</h2>

      <div className={classes.profiles}>
        {profiles.map((item) => (
          <div key={item.id} className={classes.buttonContainer}>
            <button className={classes.button} onClick={() => goToPassword(item.id!)}>
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
