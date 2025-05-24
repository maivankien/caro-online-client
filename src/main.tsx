import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CaroBoard from './components/CaroBoard.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CaroBoard />
  </StrictMode>,
)
