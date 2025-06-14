import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { NewTabPage } from './NewTabPage'

import 'toastify-js/src/toastify.css'
import 'github-markdown-css/github-markdown-dark.css'

import './global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NewTabPage />
  </StrictMode>,
)
