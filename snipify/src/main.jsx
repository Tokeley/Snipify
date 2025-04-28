import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TokenProvider } from './contexts/TokenContext.jsx';
import { SettingsProvider } from './contexts/SettingsContext.jsx';``

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TokenProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </TokenProvider>
  </StrictMode>,
)
