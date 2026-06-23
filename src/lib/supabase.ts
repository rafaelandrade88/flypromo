import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://eyxhioyqanamgbocfslt.supabase.co'
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY ??
  'sb_publishable_Hh77PODraCGTHqUV7Wt0PA_5-2DZ5H6'

export const EDGE_SEARCH = `${SUPABASE_URL}/functions/v1/search-flights`
export const EDGE_REC = `${SUPABASE_URL}/functions/v1/ai-recommendations`
export const SUPABASE_ANON_KEY = SUPABASE_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
