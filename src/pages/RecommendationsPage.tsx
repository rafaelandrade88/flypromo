import { useState } from 'react'
import { toast } from 'sonner'
import { EDGE_REC, SUPABASE_ANON_KEY } from '@/lib/supabase'
import { RecForm } from '@/components/recommendations/RecForm'
import { RecResults } from '@/components/recommendations/RecResults'
import type {
  Recommendation,
  RecommendationParams,
  RecommendationResponse,
} from '@/types'

export function RecommendationsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [generalTip, setGeneralTip] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSubmit(params: RecommendationParams) {
    if (!params.origin) {
      toast.error('Informe a cidade de origem')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const res = await fetch(EDGE_REC, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(params),
      })
      const data: RecommendationResponse = await res.json()
      if (data.error) throw new Error(data.error)

      setRecommendations(data.recommendations ?? [])
      setGeneralTip(data.generalTip ?? null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado'
      setError(message)
      setRecommendations([])
      setGeneralTip(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <RecForm loading={loading} onSubmit={handleSubmit} />
      <RecResults
        loading={loading}
        error={error}
        recommendations={recommendations}
        generalTip={generalTip}
        hasSearched={hasSearched}
      />
    </div>
  )
}
