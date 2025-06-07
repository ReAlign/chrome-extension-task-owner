import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { NewTabPage } from './NewTabPage'

import 'vditor/dist/index.css'
import 'vditor/dist/css/content-theme/dark.css'

import './global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewTabPage />
  </StrictMode>,
)
