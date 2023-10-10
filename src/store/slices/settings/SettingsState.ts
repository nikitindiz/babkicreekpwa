import { LoadableEntity, SettingsList } from 'types';

export interface SettingsState extends SettingsList {
  activeProfile: number | null;
  passwordHash: string | null;
  profileSettings: LoadableEntity<SettingsList>;
}
