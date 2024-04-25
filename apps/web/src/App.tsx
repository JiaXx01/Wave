import { ThemeProvider } from '@/components/Theme/ThemeContext'
import { SWRConfig } from 'swr'
import Router from './router'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SWRConfig
        value={{
          onErrorRetry: (error, _key, _config, _revalidate, { retryCount }) => {
            if (error.response.status === 401) return
            if (retryCount >= 5) return
          }
        }}
      >
        <Router />
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App
