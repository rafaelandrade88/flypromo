import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { SearchHistory } from '@/types'

interface SaveSearchInput {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  children: number
  resultsCount: number
  minPrice: number | null
}

export function useHistory(userId: string | null) {
  const [history, setHistory] = useState<SearchHistory[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!userId) {
      setHistory([])
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    setLoading(false)
    setHistory((data as SearchHistory[]) ?? [])
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const saveSearch = useCallback(
    async (input: SaveSearchInput) => {
      if (!userId) return
      await supabase.from('search_history').insert({
        user_id: userId,
        origin_code: input.origin,
        destination_code: input.destination,
        departure_date: input.departureDate,
        return_date: input.returnDate || null,
        adults: input.adults,
        children: input.children,
        results_count: input.resultsCount,
        min_price: input.minPrice,
      })
      await refresh()
    },
    [userId, refresh],
  )

  const clearHistory = useCallback(async () => {
    if (!userId) return
    await supabase.from('search_history').delete().eq('user_id', userId)
    toast.success('Histórico limpo')
    await refresh()
  }, [userId, refresh])

  return { history, loading, saveSearch, clearHistory, refresh }
}
