import { Plane, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { FlightCard } from './FlightCard'
import type { Flight } from '@/types'

interface FlightResultsProps {
  loading: boolean
  error: string | null
  flights: Flight[]
  hasSearched: boolean
  route: string
  isFavorite: (flight: Flight) => boolean
  onToggleFavorite: (flight: Flight) => void
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  )
}

export function FlightResults({
  loading,
  error,
  flights,
  hasSearched,
  route,
  isFavorite,
  onToggleFavorite,
}: FlightResultsProps) {
  if (loading) return <ResultsSkeleton />

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Erro na busca</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!hasSearched) {
    return (
      <EmptyState
        icon={Plane}
        title="Pronto para decolar"
        description="Informe origem, destino e data para comparar passagens."
      />
    )
  }

  if (flights.length === 0) {
    return (
      <EmptyState
        icon={Plane}
        title="Nenhum voo encontrado"
        description="Tente datas ou destinos diferentes."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold">
          {flights.length} voos encontrados · {route}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Abaixo da média</Badge>
          <Badge variant="warning">Na média</Badge>
          <Badge variant="destructive">Acima da média</Badge>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            isFavorite={isFavorite(flight)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}
