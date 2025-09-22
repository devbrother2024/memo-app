'use client'

import { createClient } from '@supabase/supabase-js'

export const supabaseBrowserClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, anonKey)
}
