import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import HeroDisplay from './components/HeroDisplay.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/dota-randomizer">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/heroes" element={<HeroDisplay />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
