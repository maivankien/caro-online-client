import { useTranslation } from '../hooks/useTranslation';

interface ILanguageSwitcherProps {
    className?: string
}

export const LanguageSwitcher = ({ className = '' }: ILanguageSwitcherProps) => {
    const { t, changeLanguage, currentLanguage } = useTranslation()

    const languages = [
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ]

    return (
        <div className={`language-switcher ${className}`}>
            <label htmlFor="language-select">{t('settings.language')}:</label>
            <select
                id="language-select"
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="language-select"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
        </div>
    )
}