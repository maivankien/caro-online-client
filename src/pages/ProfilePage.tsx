import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { authApi } from '../features/auth/services/authApi'
import type { IProfileData } from '../features/auth/types'
import AppHeader from '../components/AppHeader'
import '../styles/pages/ProfilePage.css'

const ProfilePage = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [profile, setProfile] = useState<IProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                const response = await authApi.getProfile()
                setProfile(response.data)
            } catch (err) {
                setError(t('profile.error'))
                console.error('Error fetching profile:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [t])

    const handleBack = () => {
        navigate(-1)
    }

    if (loading) {
        return (
            <div className="profile-page">
                <AppHeader title={t('profile.title')} showLogout={false} />
                <div className="profile-content">
                    <div className="loading">{t('common.loading')}</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="profile-page">
                <AppHeader title={t('profile.title')} showLogout={false} />
                <div className="profile-content">
                    <div className="error">{error}</div>
                    <button onClick={handleBack} className="back-btn">
                        {t('buttons.back')}
                    </button>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <AppHeader title={t('profile.title')} showLogout={false} />
                <div className="profile-content">
                    <div className="no-data">{t('profile.noData')}</div>
                    <button onClick={handleBack} className="back-btn">
                        {t('buttons.back')}
                    </button>
                </div>
            </div>
        )
    }

    const winRate = profile.totalGames > 0 ? ((profile.wins / profile.totalGames) * 100).toFixed(1) : 0

    return (
        <div className="profile-page">
            <AppHeader title={t('profile.title')} showLogout={false} />
            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <h2 className="profile-name">{profile.name}</h2>
                        <div className="profile-badge">
                            {profile.isGuest ? t('profile.guest') : t('profile.member')}
                        </div>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <div className="stat-label">{t('profile.elo')}</div>
                            <div className="stat-value">{profile.elo}</div>
                        </div>
                        
                        <div className="stat-item">
                            <div className="stat-label">{t('profile.totalGames')}</div>
                            <div className="stat-value">{profile.totalGames}</div>
                        </div>
                        
                        <div className="stat-item">
                            <div className="stat-label">{t('profile.wins')}</div>
                            <div className="stat-value wins">{profile.wins}</div>
                        </div>
                        
                        <div className="stat-item">
                            <div className="stat-label">{t('profile.losses')}</div>
                            <div className="stat-value losses">{profile.losses}</div>
                        </div>
                        
                        <div className="stat-item">
                            <div className="stat-label">{t('profile.winRate')}</div>
                            <div className="stat-value">{winRate}%</div>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button onClick={handleBack} className="back-btn">
                            {t('buttons.back')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
