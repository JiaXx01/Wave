import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './auth/Login'
import Layout from './page/Layout'
import Chat from './page/chat/Chat'
import Note from './page/note/Note'

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
        path: '/note',
        element: <Note />
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
