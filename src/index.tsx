import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import 'normalize.css';
import 'react-day-picker/dist/style.css';

import './index.css';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from 'store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

navigator.serviceWorker.getRegistrations().then((registrationsArray) => {
  console.log('registrationsArray', registrationsArray);
  registrationsArray[0]?.update();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
