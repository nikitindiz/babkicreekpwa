import React, { FC, useState, useEffect, useCallback } from 'react';
import { ProfileSettingsForm } from 'components';
import { useSettings } from 'utils/store/hooks';
import { useSelector } from 'react-redux';
import { settings } from 'store';
import { db } from 'models';

export const ProfileSettingsFormContainer: FC = () => {
  const {
    settings: settingsData,
    isLoading,
    handleCurrencyChange,
    handleLanguageChange,
    handleTimeZoneChange,
    handleMaxMoneyValueChange,
    handleSave,
    isSaving,
    isDirty,
  } = useSettings();

  const activeProfileId = useSelector(settings.selectors.activeProfile);
  const [profileLabel, setProfileLabel] = useState('');
  const [isProfileLabelDirty, setIsProfileLabelDirty] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Load profile data when component mounts or profile changes
  useEffect(() => {
    if (activeProfileId) {
      const loadProfileData = async () => {
        try {
          const profile = await db.profiles.get(activeProfileId);
          if (profile) {
            setProfileLabel(profile.label || '');
            setIsProfileLabelDirty(false);
          }
        } catch (error) {
          console.error('Failed to load profile data:', error);
        }
      };

      loadProfileData();
    }
  }, [activeProfileId]);

  const handleLabelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileLabel(event.target.value);
    setIsProfileLabelDirty(true);
  }, []);

  // Combined save handler for both settings and profile label
  const handleCombinedSave = useCallback(async () => {
    // Save settings
    handleSave();

    // Save profile label if changed
    if (isProfileLabelDirty && activeProfileId) {
      setIsSavingProfile(true);
      try {
        const profile = await db.profiles.get(activeProfileId);
        if (profile) {
          await db.profiles.update(activeProfileId, {
            ...profile,
            label: profileLabel,
          });
        }
        setIsProfileLabelDirty(false);
      } catch (error) {
        console.error('Failed to update profile label:', error);
      } finally {
        setIsSavingProfile(false);
      }
    }
  }, [handleSave, isProfileLabelDirty, activeProfileId, profileLabel]);

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <ProfileSettingsForm
      isDirty={isDirty || isProfileLabelDirty}
      handleSave={handleCombinedSave}
      isLoading={isSaving || isSavingProfile}
      currency={settingsData.currency}
      language={settingsData.language}
      timezone={settingsData.timezone}
      maxMoneyValue={settingsData.maxMoneyValue || ''}
      label={profileLabel}
      handleCurrencyChange={handleCurrencyChange}
      handleLanguageChange={handleLanguageChange}
      handleTimeZoneChange={handleTimeZoneChange}
      handleMaxMoneyValueChange={handleMaxMoneyValueChange}
      handleLabelChange={handleLabelChange}
    />
  );
};
