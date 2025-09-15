import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import OBSOverlay from './components/OBSOverlay.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/dota-randomizer">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/obs" element={<OBSOverlay />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
