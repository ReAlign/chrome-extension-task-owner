import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { NewTabPage } from './NewTabPage'

import './global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewTabPage />
  </StrictMode>,
)
