import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'redux/store'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import { transitions, positions, Provider as AlertProvider } from '@blaumaus/react-alert'

import CrashHandler from 'pages/CrashHandler'
// import { trackViews } from 'utils/analytics'
import AlertTemplate from 'ui/Alert'
import App from './App'
import i18next from './i18next'
import './index.css'

// trackViews()

console.log('%cWelcome, hacker, glad you opened your console, you seem serious about your craft and will go a long way!\nP.S. All the bugs, feature requests are welcome to be sent to security@swetrix.com', 'color: #818cf8;background: #1f2937;font-size: 20px;text-shadow: 2px 2px black')

const options = {
  position: positions.BOTTOM_RIGHT,
  timeout: 8000,
  offset: '30px',
  transition: transitions.SCALE,
}

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'swetrix-marketplace:*'
}

const container = document.getElementById('root')
const root = createRoot(container)

// Disabled StrictMode until I fix issues related to navigation issues
// Possibly it's related to 'Strict Mode has gotten stricter in React 18' -> https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-strict-mode
root.render(
  // <React.StrictMode>
  <CrashHandler>
    <AlertProvider template={AlertTemplate} {...options}>
      <Provider store={store}>
        <HelmetProvider>
          <BrowserRouter>
            <I18nextProvider i18n={i18next}>
              <App />
            </I18nextProvider>
          </BrowserRouter>
        </HelmetProvider>
      </Provider>
    </AlertProvider>
  </CrashHandler>,
  // </React.StrictMode>
)
