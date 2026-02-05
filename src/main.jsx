import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { LanguageProvider } from './context/LanguageContext'
import { WhatsAppProvider } from './context/WhatsAppContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <WhatsAppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WhatsAppProvider>
    </LanguageProvider>
  </StrictMode>,
)
