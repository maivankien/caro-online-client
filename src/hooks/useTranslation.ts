import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (namespace = 'common') => {
    const { t, i18n } = useI18nTranslation(namespace)

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language)
    }

    const currentLanguage = i18n.language

    return {
        t,
        changeLanguage,
        currentLanguage,
        isVietnamese: currentLanguage === 'vi',
        isEnglish: currentLanguage === 'en'
    }
}
