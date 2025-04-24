import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import enMessages from './lang/en.json';
import ruMessages from './lang/ru.json';

import './App.css';

import { ChartScreen, CreateProfileScreen, EnterProfileScreen, LockScreen } from './screens';
import { FadeOnMountEvents } from 'components';
import { ScreenEnum } from 'types';
import { db } from 'models';
import { settings } from 'store';
import { useScreens } from 'utils/store/hooks';
import { currentVersion } from './currentVersion';
import { changeLog } from './changelog';

const localizations: Record<string, typeof enMessages> = {
  en: enMessages,
  ru: ruMessages,
};

function App() {
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const { goTo, currentScreen } = useScreens();
  console.log(`BabkiCreek v${currentVersion} changlog:`, changeLog);

  useEffect(() => {
    if (activeProfile) {
      db.open().catch(console.error);

      return;
    }

    goTo(ScreenEnum.welcome);
  }, [activeProfile, goTo]);

  const language = useSelector(settings.selectors.language);

  return (
    <>
      <IntlProvider messages={localizations[language]} locale={language} defaultLocale="en">
        <FadeOnMountEvents show={currentScreen === ScreenEnum.welcome}>
          <LockScreen />
        </FadeOnMountEvents>

        <FadeOnMountEvents show={currentScreen === ScreenEnum.chart}>
          <ChartScreen />
        </FadeOnMountEvents>

        <FadeOnMountEvents show={currentScreen === ScreenEnum.createProfile}>
          <CreateProfileScreen />
        </FadeOnMountEvents>

        <FadeOnMountEvents show={currentScreen === ScreenEnum.enterProfile}>
          <EnterProfileScreen />
        </FadeOnMountEvents>
      </IntlProvider>
    </>
  );
}

export default App;
