import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en';
import vi from './vi';

const resources = {
    en: en,
    vi: vi
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'vi',
        debug: import.meta.env.DEV,

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage']
        },

        interpolation: {
            escapeValue: false
        },

        ns: ['common'],
        defaultNS: 'common'
    })

export default i18n 