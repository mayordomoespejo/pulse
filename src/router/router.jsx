import { createBrowserRouter, Navigate } from 'react-router-dom'

import MainLayout from '../layout/MainLayout'
import Error from '../pages/Error'
import FeaturedPage from '../pages/FeaturedPage'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import PlayerPlaylistPage from '../pages/PlayerPlaylistPage'
import VideoManage from '../pages/VideoManage'

import RequireAuth from './RequireAuth'
import { ROUTES_NAMES } from './routesNames'

export const routes = [
  { path: ROUTES_NAMES.LOGIN, element: <Login /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: ROUTES_NAMES.ROOT,
        element: <MainLayout />,
        children: [
          { path: ROUTES_NAMES.ROOT, element: <FeaturedPage /> },
          { path: ROUTES_NAMES.VIDEOS, element: <VideoManage /> },
          { path: ROUTES_NAMES.LEGACY_VIDEOS, element: <Navigate to={ROUTES_NAMES.VIDEOS} replace /> },
          { path: ROUTES_NAMES.VIDEO_DETAIL, element: <PlayerPlaylistPage /> },
        ],
      },
    ],
  },
  { path: ROUTES_NAMES.ERROR, element: <Error /> },
  { path: ROUTES_NAMES.NOT_FOUND, element: <NotFound /> },
]

export const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
  },
})
