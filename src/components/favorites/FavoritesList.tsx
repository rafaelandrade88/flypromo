import { Heart, Plane, Trash2, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { formatBRL, formatDate } from '@/lib/utils'
import type { Favorite } from '@/types'

interface FavoritesListProps {
  favorites: Favorite[]
  loading: boolean
  onRemove: (id: string) => void
}

export function FavoritesList({ favorites, loading, onRemove }: FavoritesListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Nenhum favorito ainda"
        description="Salve voos interessantes durante sua busca."
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {favorites.map((fav) => (
        <Card key={fav.id}>
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Plane className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {fav.origin_code} → {fav.destination_code}
                {fav.airline ? ` · ${fav.airline}` : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(fav.departure_date)} · salvo em {formatDate(fav.created_at)}
              </p>
            </div>
            <span className="font-semibold">{formatBRL(Number(fav.price))}</span>
            {fav.booking_url ? (
              <Button asChild variant="outline" size="sm">
                <a href={fav.booking_url} target="_blank" rel="noopener noreferrer">
                  Ver
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remover favorito"
              onClick={() => onRemove(fav.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
