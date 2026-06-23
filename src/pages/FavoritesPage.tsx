import { FavoritesList } from '@/components/favorites/FavoritesList'
import type { Favorite } from '@/types'

interface FavoritesPageProps {
  favorites: Favorite[]
  loading: boolean
  onRemove: (id: string) => void
}

export function FavoritesPage({ favorites, loading, onRemove }: FavoritesPageProps) {
  return (
    <FavoritesList favorites={favorites} loading={loading} onRemove={onRemove} />
  )
}
