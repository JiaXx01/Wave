import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './auth/Login'
import Layout from './page/Layout'
import Chat from './page/chat/Chat'
import AllNotes from './page/note/AllNotes'
const Note = lazy(() => import('./page/note/Note'))

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
            <Note />
          </Suspense>
        ),
        loader: async ({ params }) => {
          return Promise.resolve(params.id)
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
