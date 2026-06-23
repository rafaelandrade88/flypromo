import { useState } from 'react'
import { toast } from 'sonner'
import { EDGE_SEARCH, SUPABASE_ANON_KEY } from '@/lib/supabase'
import { SearchForm } from '@/components/search/SearchForm'
import { FlightResults } from '@/components/search/FlightResults'
import type { Flight, SearchParams, SearchResponse } from '@/types'

interface SearchPageProps {
  isFavorite: (flight: Flight) => boolean
  onToggleFavorite: (flight: Flight) => void
  onSearchSaved: (input: {
    origin: string
    destination: string
    departureDate: string
    returnDate?: string
    adults: number
    children: number
    resultsCount: number
    minPrice: number | null
  }) => void
}

export function SearchPage({
  isFavorite,
  onToggleFavorite,
  onSearchSaved,
}: SearchPageProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [route, setRoute] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch(params: SearchParams) {
    if (!params.originCode || !params.destinationCode || !params.departureDate) {
      toast.error('Preencha origem, destino e data de ida')
      return
    }
    if (params.originCode.length !== 3 || params.destinationCode.length !== 3) {
      toast.error('Códigos IATA devem ter 3 letras (ex: GRU, MIA)')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)
    setRoute(`${params.originCode} → ${params.destinationCode}`)

    try {
      const res = await fetch(EDGE_SEARCH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(params),
      })
      const data: SearchResponse = await res.json()
      if (data.error) throw new Error(data.error)

      const results = data.flights ?? []
      setFlights(results)

      if (results.length > 0) {
        onSearchSaved({
          origin: params.originCode,
          destination: params.destinationCode,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.adults,
          children: params.children,
          resultsCount: results.length,
          minPrice: data.stats?.minPrice ?? null,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado'
      setError(message)
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchForm loading={loading} onSearch={handleSearch} />
      <FlightResults
        loading={loading}
        error={error}
        flights={flights}
        hasSearched={hasSearched}
        route={route}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  )
}
