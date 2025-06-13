import '@/styles/pages/HomePage.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useAppStore } from '@/store';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const HomePage = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const { createGuest } = useAuth()
    const { error, clearError } = useAppStore()
    const { t } = useTranslation()
    const [localMessage, setLocalMessage] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            navigate('/game')
        }
    }, [navigate])


    useEffect(() => {
        clearError()
    }, [clearError])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalMessage(null)

        await createGuest({ name: username })
        navigate('/game')
    }

    return (
        <div className="homepage">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container"
            >
                <div className="language-switcher-container">
                    <LanguageSwitcher />
                </div>

                <h1>{t('homepage.title')}</h1>

                <form onSubmit={handleSubmit} className="search-form">
                    <div className="input-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('homepage.placeholder')}
                            className="username-input"
                        />
                        <div className="button-group">
                            <button
                                type="submit"
                                disabled={!username.trim()}
                                className="create-btn"
                            >
                                {t('buttons.startPlaying')}
                            </button>
                        </div>
                    </div>
                </form>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="error-message"
                    >
                        <p>{error}</p>
                    </motion.div>
                )}

                {localMessage && !error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="success-message"
                    >
                        <p>{localMessage}</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default HomePage