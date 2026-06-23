import { useCallback, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  const loadProfile = useCallback(async (user: User | null) => {
    if (!user) return null
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
    return (data as Profile | null) ?? null
  }, [])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      const profile = await loadProfile(session?.user ?? null)
      if (active) {
        setState({ user: session?.user ?? null, profile, loading: false })
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session: Session | null) => {
        const profile = await loadProfile(session?.user ?? null)
        if (active) {
          setState({ user: session?.user ?? null, profile, loading: false })
        }
      },
    )

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { ...state, signOut }
}
