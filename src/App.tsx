import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { GameListPage } from './pages/GameListPage'
import { GameDetailPage } from './pages/GameDetailPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/games" replace />} />
        <Route path="/games" element={<GameListPage />} />
        <Route path="/games/:identifier" element={<GameDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
