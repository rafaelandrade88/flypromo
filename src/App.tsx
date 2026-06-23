import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { useHistory } from '@/hooks/useHistory'
import { AuthScreen } from '@/components/auth/AuthScreen'
import { AppLayout } from '@/components/layout/AppLayout'
import type { NavKey } from '@/components/layout/SidebarNav'
import { SearchPage } from '@/pages/SearchPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { HistoryPage } from '@/pages/HistoryPage'

const PAGE_TITLES: Record<NavKey, string> = {
  search: 'Buscar voos',
  recommendations: 'Recomendações IA',
  favorites: 'Favoritos',
  history: 'Histórico de buscas',
}

export default function App() {
  const { user, profile, loading, signOut } = useAuth()
  const [page, setPage] = useState<NavKey>('search')

  const userId = user?.id ?? null
  const { favorites, isFavorite, toggleFavorite, removeFavorite, loading: favLoading } =
    useFavorites(userId)
  const { history, loading: histLoading, saveSearch, clearHistory } =
    useHistory(userId)

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
        <Toaster richColors position="top-center" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AuthScreen />
        <Toaster richColors position="top-center" />
      </>
    )
  }

  return (
    <>
      <AppLayout
        active={page}
        onNavigate={setPage}
        user={user}
        profile={profile}
        onSignOut={signOut}
        title={PAGE_TITLES[page]}
      >
        {page === 'search' ? (
          <SearchPage
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSearchSaved={saveSearch}
          />
        ) : null}
        {page === 'recommendations' ? <RecommendationsPage /> : null}
        {page === 'favorites' ? (
          <FavoritesPage
            favorites={favorites}
            loading={favLoading}
            onRemove={removeFavorite}
          />
        ) : null}
        {page === 'history' ? (
          <HistoryPage
            history={history}
            loading={histLoading}
            onClear={clearHistory}
          />
        ) : null}
      </AppLayout>
      <Toaster richColors position="top-center" />
    </>
  )
}
