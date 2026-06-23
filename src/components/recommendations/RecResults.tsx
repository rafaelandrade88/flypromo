import { Bot, AlertCircle, Lightbulb } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { RecCard } from './RecCard'
import type { Recommendation } from '@/types'

interface RecResultsProps {
  loading: boolean
  error: string | null
  recommendations: Recommendation[]
  generalTip: string | null
  hasSearched: boolean
}

function RecSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  )
}

export function RecResults({
  loading,
  error,
  recommendations,
  generalTip,
  hasSearched,
}: RecResultsProps) {
  if (loading) return <RecSkeleton />

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Erro ao gerar recomendações</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!hasSearched) {
    return (
      <EmptyState
        icon={Bot}
        title="Descubra destinos sob medida"
        description="Conte de onde você sai e deixe a IA sugerir destinos com bom custo-benefício."
      />
    )
  }

  if (recommendations.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="Nenhuma recomendação"
        description="Tente ajustar a origem ou as preferências."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {generalTip ? (
        <Alert>
          <Lightbulb />
          <AlertTitle>Dica de economia</AlertTitle>
          <AlertDescription>{generalTip}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec) => (
          <RecCard key={`${rec.rank}-${rec.iataCode}`} rec={rec} />
        ))}
      </div>
    </div>
  )
}
