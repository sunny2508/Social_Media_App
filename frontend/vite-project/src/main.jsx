import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {Provider} from './components/ui/provider.jsx'
import {BrowserRouter as Router} from 'react-router-dom'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
    <Provider>
     <Router>
    <App />
    </Router>
    </Provider>
    </RecoilRoot>
  </StrictMode>,
)
