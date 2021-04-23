// import global styles first, so all other required styles override defaults (bootstrap in our case)
import 'core-js/stable';
import './global.scss';
import 'react-app-polyfill/ie9'; // Required to support IE 9-11
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import React from 'react';
import { render } from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import english from './locales/en.json';
import german from './locales/de.json';
import { getCurrentLanguage } from './utils/languageUtils';

const browserLanguage = getCurrentLanguage().ISOCode;
i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  react: { useSuspense: false },
  lng: browserLanguage,
  fallbackLng: 'en',
  resources: {
    en: {
      common: english,
    },
    de: {
      common: german,
    },
  },
});

const { store, persistor } = configureStore();

render(
  <PersistGate persistor={persistor}>
    <I18nextProvider i18n={i18next}>
      <Root store={store} history={history} />
    </I18nextProvider>
  </PersistGate>,
  document.getElementById('root'),
);
