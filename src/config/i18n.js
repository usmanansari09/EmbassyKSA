import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import ur from '../locales/ur.json';
const resources = {en, ur};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
});

export default i18n;
