import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import he from './locales/he.json'

const resources = {
   en: {
      translation: en,
   },
   he: {
      translation: he,
   },
}

i18n.use(initReactI18next).init({
   resources,
   lng: localStorage.getItem('language') || 'he',
   fallbackLng: localStorage.getItem('language') || 'he',
   interpolation: {
      escapeValue: false,
   },
})

export default i18n
