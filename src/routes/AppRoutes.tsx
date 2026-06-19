import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { StorePage } from '../pages/StorePage'
import { GameDetailsPage } from '../pages/GameDetailsPage'
import { LibraryPage } from '../pages/LibraryPage'
import { CreateGamePage } from '../pages/CreateGamePage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<StorePage />} />
      <Route path="library" element={<LibraryPage />} />
      <Route path="games/create" element={<CreateGamePage />} />
      <Route path="games/:id" element={<GameDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
