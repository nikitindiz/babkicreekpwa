import { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DeleteProfile } from 'components';
import { settings } from 'store';
import { db } from 'models';

export const DeleteProfileContainer: FC = () => {
  const activeProfileId = useSelector(settings.selectors.activeProfile);
  const [profileLabel, setProfileLabel] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (activeProfileId) {
        const profile = await db.profiles.get(activeProfileId);
        if (profile) {
          setProfileLabel(profile.label || '');
        }
      }
    };

    fetchProfileData();
  }, [activeProfileId]);

  const handleDeleteProfile = async () => {
    if (activeProfileId) {
      // Delete all related data from the database
      await Promise.all([
        // Delete days
        ...(await db.days.where({ profileId: activeProfileId }).toArray()).map(({ id }) =>
          db.deleteDay(id!),
        ),
        // Delete sources
        ...(await db.sources.where({ profileId: activeProfileId }).toArray()).map(({ id }) =>
          db.deleteSource(id!),
        ),
        // Delete source schedule metas
        ...(await db.sourceScheduleMetas.where({ profileId: activeProfileId }).toArray()).map(
          ({ id }) => db.deleteSourceScheduleMeta(id!),
        ),
        // Delete drains
        ...(await db.drains.where({ profileId: activeProfileId }).toArray()).map(({ id }) =>
          db.deleteDrain(id!),
        ),
        // Delete drain schedule metas
        ...(await db.drainScheduleMetas.where({ profileId: activeProfileId }).toArray()).map(
          ({ id }) => db.deleteDrainScheduleMeta(id!),
        ),
      ]);

      // Finally delete the profile itself
      await db.profiles.delete(activeProfileId);

      localStorage.removeItem('profileId');
      localStorage.removeItem('passwordHash');
      localStorage.removeItem('rememberProfile');
      localStorage.removeItem('timeZone');

      sessionStorage.removeItem('profileId');
      sessionStorage.removeItem('passwordHash');
      sessionStorage.removeItem('rememberProfile');
      sessionStorage.removeItem('timeZone');

      window.location.reload();
    }
  };

  return <DeleteProfile profileLabel={profileLabel} handleDeleteProfile={handleDeleteProfile} />;
};
