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

// import type QR from 'qr-encode';
import QR from 'qr-encode';

const localizations: Record<string, typeof enMessages> = {
  en: enMessages,
  ru: ruMessages,
};

function App() {
  const activeProfile = useSelector(settings.selectors.activeProfile);
  const { goTo, currentScreen } = useScreens();

  // console.log(
  //   QR(
  //     'v=0\r\no=- 1389656642233944179 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 61277 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 192.168.1.2\r\na=candidate:363729068 1 udp 2122260223 192.168.1.2 61277 typ host generation 0 network-id 1 network-cost 10\r\na=candidate:1801581108 1 tcp 1518280447 192.168.1.2 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:VHHj\r\na=ice-pwd:Q/iOEfLHTbhGjPHdWAI36Fqy\r\na=ice-options:trickle\r\na=fingerprint:sha-256 28:C0:91:23:AC:23:EB:F7:AE:2B:1C:63:7B:E6:74:01:57:8D:64:E5:DC:A5:75:AF:B6:8C:74:8C:B4:DD:34:3B\r\na=setup:actpass\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n',
  //     { type: 30, size: 30, level: 'Q' },
  //   ),
  // );

  useEffect(() => {
    if (activeProfile) {
      db.open().catch(console.error);

      return;
    }

    goTo(ScreenEnum.welcome);
  }, [activeProfile, goTo]);

  // const id = window.innerWidth < 800 ? 'mobile' : 'desktop';
  //
  // const peer = useRef(
  //   new Peer({
  //     debug: 3,
  //     // Set a logging function:
  //     // logFunction: function () {
  //     //   var copy = Array.prototype.slice.call(arguments).join(' ');
  //     //   console.log('copy', copy);
  //     // },
  //   }),
  // );
  //
  // useEffect(() => {
  //   console.log('id, connectTo', id, id === 'mobile' ? 'desktop' : 'mobile');
  //
  //   if (window.innerWidth < 800) {
  //     console.log('mobile');
  //
  //     const conn = peer.current.connect('8c19a335-fc29-49f5-b160-5a253b8d4122');
  //
  //     conn.on('open', () => {
  //       console.log('open');
  //       conn.send('hi!');
  //     });
  //
  //     return;
  //   }
  //
  //   console.log('desktop');
  //
  //   peer.current.on('open', function (id) {
  //     console.log('My peer ID is: ' + id);
  //   });
  //
  //   peer.current.on('connection', (conn) => {
  //     conn.on('data', (data) => {
  //       // Will print 'hi!'
  //       console.log(data);
  //     });
  //     conn.on('open', () => {
  //       console.log('sent');
  //       conn.send('hello!');
  //     });
  //   });
  // }, []);

  const language = useSelector(settings.selectors.language);

  return (
    <>
      <IntlProvider messages={localizations[language]} locale={language} defaultLocale="en">
        {/*<IntlProvider messages={messagesInFrench} locale="fr" defaultLocale="en">*/}
        {/*<IntlProvider messages={messagesInRussian} locale="ru" defaultLocale="en">*/}
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
        {/*</IntlProvider>*/}
        {/*</IntlProvider>*/}
      </IntlProvider>
    </>
  );
}

export default App;
