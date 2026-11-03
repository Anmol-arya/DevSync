import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. Import BrowserRouter
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap the App component to enable routing everywhere */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)


