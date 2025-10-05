import '@/styles/pages/HomePage.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useAppStore } from '@/store';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type AuthMode = 'guest' | 'register' | 'login'

const HomePage = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [authMode, setAuthMode] = useState<AuthMode>('guest')
    const { createGuest, register, login } = useAuth()
    const { error, clearError } = useAppStore()
    const { t } = useTranslation()
    const [localMessage, setLocalMessage] = useState<string | null>(null)

    // Register form state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            navigate('/room')
        }
    }, [navigate])


    useEffect(() => {
        clearError()
    }, [clearError])

    const handleGuestSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalMessage(null)

        await createGuest({ name: username })
        navigate('/room')
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalMessage(null)

        if (registerData.password !== registerData.confirmPassword) {
            setLocalMessage('Mật khẩu xác nhận không khớp')
            return
        }

        await register({
            name: registerData.name,
            email: registerData.email,
            password: registerData.password
        })
        navigate('/room')
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalMessage(null)

        await login({
            email: loginData.email,
            password: loginData.password
        })
        navigate('/room')
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

                {/* Sidebar Navigation Layout */}
                <div className="auth-container">
                    {/* Sidebar */}
                    <div className="auth-sidebar">
                        <div className="auth-mode-selector">
                            <button
                                type="button"
                                className={`auth-mode-btn ${authMode === 'guest' ? 'active' : ''}`}
                                onClick={() => setAuthMode('guest')}
                            >
                                {t('homepage.authMode.guest')}
                            </button>
                            <button
                                type="button"
                                className={`auth-mode-btn ${authMode === 'register' ? 'active' : ''}`}
                                onClick={() => setAuthMode('register')}
                            >
                                {t('homepage.authMode.register')}
                            </button>
                            <button
                                type="button"
                                className={`auth-mode-btn ${authMode === 'login' ? 'active' : ''}`}
                                onClick={() => setAuthMode('login')}
                            >
                                {t('homepage.authMode.login')}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="auth-content">

                        {/* Guest Form */}
                        {authMode === 'guest' && (
                            <form onSubmit={handleGuestSubmit} className="search-form">
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
                                            className="auth-btn"
                                        >
                                            {t('buttons.startPlaying')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Register Form */}
                        {authMode === 'register' && (
                            <form onSubmit={handleRegisterSubmit} className="auth-form">
                                <h2>{t('homepage.register.title')}</h2>
                                <div className="form-group">
                                    <label className="form-label">{t('homepage.register.name')}</label>
                                    <input
                                        type="text"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        placeholder={t('homepage.register.namePlaceholder')}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('homepage.register.email')}</label>
                                    <input
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        placeholder={t('homepage.register.emailPlaceholder')}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('homepage.register.password')}</label>
                                    <input
                                        type="password"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        placeholder={t('homepage.register.passwordPlaceholder')}
                                        className="form-input"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('homepage.register.confirmPassword')}</label>
                                    <input
                                        type="password"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        placeholder={t('homepage.register.confirmPasswordPlaceholder')}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="auth-btn"
                                >
                                    {t('homepage.register.submit')}
                                </button>
                                <button
                                    type="button"
                                    className="switch-auth-btn"
                                    onClick={() => setAuthMode('login')}
                                >
                                    {t('homepage.register.switchToLogin')}
                                </button>
                            </form>
                        )}

                        {/* Login Form */}
                        {authMode === 'login' && (
                            <form onSubmit={handleLoginSubmit} className="auth-form">
                                <h2>{t('homepage.login.title')}</h2>
                                <div className="form-group">
                                    <label className="form-label">{t('homepage.login.email')}</label>
                                    <input
                                        type="email"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        placeholder={t('homepage.login.emailPlaceholder')}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('homepage.login.password')}</label>
                                    <input
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        placeholder={t('homepage.login.passwordPlaceholder')}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="auth-btn"
                                >
                                    {t('homepage.login.submit')}
                                </button>
                                <button
                                    type="button"
                                    className="switch-auth-btn"
                                    onClick={() => setAuthMode('register')}
                                >
                                    {t('homepage.login.switchToRegister')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

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