import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { NextUIProvider } from '@nextui-org/react'
import './index.css'
import TestContextProvider from './context/TestContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <TestContextProvider>
      <App />
    </TestContextProvider>
  </NextUIProvider>
)
