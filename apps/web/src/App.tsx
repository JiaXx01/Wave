import { ThemeProvider } from '@/components/Theme/ThemeContext'
import { SWRConfig } from 'swr'
import Router from '@/router'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SWRConfig
          value={{
            onErrorRetry: error => {
              if (error?.response?.status === 401) return
            },
            revalidateOnFocus: false
          }}
        >
          <Router />
        </SWRConfig>
      </ThemeProvider>
      <Toaster />
    </>
  )
}

export default App
