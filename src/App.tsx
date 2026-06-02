import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { GameListPage } from '@/pages/GameListPage'
import { GameDetailPage } from '@/pages/GameDetailPage'
import { PublisherPage } from '@/pages/PublisherPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/games" element={<GameListPage />} />
        <Route path="/games/:id" element={<GameDetailPage />} />
        <Route path="/publisher/:id" element={<PublisherPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
