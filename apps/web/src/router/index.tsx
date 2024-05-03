import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './auth/Login'
import Layout from './page/Layout'
import Chat from './page/chat/Chat'
import AllNotes from './page/note/AllNotes'
import FileLayout from './page/file/FileLayout'
import { findNote } from '@/lib/api/note'
import KeepAliveLayout from './KeepAlive'
import Files from './page/file/Files'
const NotePage = lazy(() => import('./page/note/NotePage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/note" />
      },
      {
        path: 'note',
        element: <AllNotes />
      },
      {
        path: 'note/:id',
        element: (
          <Suspense>
            <NotePage />
          </Suspense>
        ),
        loader: async ({ params }) => {
          return findNote(params.id!)
        }
      },
      {
        path: 'chat',
        element: <Chat />
      },
      {
        // path: 'file',
        element: <FileLayout />,
        children: [
          {
            path: '/file/*',
            element: <Files />
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    element: <Login />
  }
])

export default function Router() {
  return (
    <KeepAliveLayout keepPaths={['/note', '/chat', '/file']}>
      <RouterProvider router={router} />
    </KeepAliveLayout>
  )
}
