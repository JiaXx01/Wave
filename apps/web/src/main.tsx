import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(timezone)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </>
)
