import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { Favorite, Flight } from '@/types'

/**
 * A favorite is keyed by user + origin + destination. We expose a Set of
 * "ORIGIN-DEST" keys so cards can derive their favorited state from React
 * state instead of serializing flight data into the DOM (Bug 1).
 */
function flightKey(origin: string, destination: string): string {
  return `${origin}-${destination}`
}

export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [keys, setKeys] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!userId) {
      setFavorites([])
      setKeys(new Set())
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) return
    const rows = (data as Favorite[]) ?? []
    setFavorites(rows)
    setKeys(new Set(rows.map((f) => flightKey(f.origin_code, f.destination_code))))
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const isFavorite = useCallback(
    (flight: Flight) =>
      keys.has(flightKey(flight.departure.airport, flight.arrival.airport)),
    [keys],
  )

  const toggleFavorite = useCallback(
    async (flight: Flight) => {
      if (!userId) {
        toast.error('Faça login para salvar favoritos')
        return
      }
      const key = flightKey(flight.departure.airport, flight.arrival.airport)

      if (keys.has(key)) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('origin_code', flight.departure.airport)
          .eq('destination_code', flight.arrival.airport)
        if (error) {
          toast.error('Erro ao remover favorito')
          return
        }
        toast.success('Removido dos favoritos')
        await refresh()
        return
      }

      const { error } = await supabase.from('favorites').insert({
        user_id: userId,
        flight_offer: flight,
        origin_code: flight.departure.airport,
        destination_code: flight.arrival.airport,
        departure_date: (flight.departure.time || '').split('T')[0].split(' ')[0],
        price: flight.price.total,
        currency: flight.price.currency,
        airline: flight.airlines[0] ?? null,
        booking_url: flight.bookingLink,
      })
      if (error) {
        if (error.code === '23505') toast.info('Já está nos favoritos')
        else toast.error('Erro ao salvar favorito')
        return
      }
      toast.success('Adicionado aos favoritos')
      await refresh()
    },
    [userId, keys, refresh],
  )

  const removeFavorite = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('favorites').delete().eq('id', id)
      if (error) {
        toast.error('Erro ao remover favorito')
        return
      }
      toast.success('Favorito removido')
      await refresh()
    },
    [refresh],
  )

  return { favorites, isFavorite, toggleFavorite, removeFavorite, loading, refresh }
}
