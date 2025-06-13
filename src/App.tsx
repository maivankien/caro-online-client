import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import Router from './router'
import { ToastContainer } from '@/components/Toast'
import { ToastProvider } from '@/contexts/ToastContext'
import './App.css'

const App = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff'
                }
            }}
        >
            <ToastProvider>
                <BrowserRouter>
                    <div className="app-container">
                        <Router />
                        <ToastContainer />
                    </div>
                </BrowserRouter>
            </ToastProvider>
        </ConfigProvider>
    )
}

export default App
