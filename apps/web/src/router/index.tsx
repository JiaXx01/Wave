import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './auth/Login'
import Layout from './page/Layout'
import Chat from './page/chat/Chat'
import AllNotes from './page/note/AllNotes'
import { findNote } from '@/lib/api/note'
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
        // loader: async () => {
        //   return getNotes()
        // }
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
      }
    ]
  },
  {
    path: 'login',
    element: <Login />
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}
