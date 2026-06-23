import { ClipboardList, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { formatBRL, formatDate } from '@/lib/utils'
import type { SearchHistory } from '@/types'

interface HistoryListProps {
  history: SearchHistory[]
  loading: boolean
}

export function HistoryList({ history, loading }: HistoryListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Nenhuma busca ainda"
        description="Suas buscas de voos aparecerão aqui."
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {history.map((h) => (
        <Card key={h.id}>
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {h.origin_code} → {h.destination_code}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(h.departure_date)}
                {h.return_date ? ` · Volta ${formatDate(h.return_date)}` : ''} ·{' '}
                {h.adults} adulto(s) · {h.results_count} voos
              </p>
            </div>
            {h.min_price ? (
              <span className="text-sm font-medium">
                A partir de {formatBRL(Number(h.min_price))}
              </span>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
