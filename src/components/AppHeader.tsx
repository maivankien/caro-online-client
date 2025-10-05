import { useAppStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { LanguageSwitcher } from './LanguageSwitcher'

interface IAppHeaderProps {
    title: string
    showLogout?: boolean
    showWelcomeMessage?: boolean
    showProfile?: boolean
}

const AppHeader = ({ title, showLogout = true, showWelcomeMessage = true, showProfile = true }: IAppHeaderProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const user = useAppStore(state => state.user)

    const handleLogout = () => {
        useAppStore.getState().logout()
        navigate('/')
    }

    const handleProfile = () => {
        navigate('/profile')
    }

    return (
        <header className="room-header">
            <div className="header-content">
                <div className="header-left">
                    <h1>{title}</h1>
                    {showWelcomeMessage && user && (
                        <p className="welcome-text">
                            {t('gamePage.welcomeUser', { name: user.name })}
                        </p>
                    )}
                </div>
                <div className="header-right">
                    <LanguageSwitcher />
                    {showProfile && user && (
                        <button
                            onClick={handleProfile}
                            className="profile-btn"
                        >
                            {t('profile.title')}
                        </button>
                    )}
                    {showLogout && (
                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            {t('buttons.logout')}
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default AppHeader 