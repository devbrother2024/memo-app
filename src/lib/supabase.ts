import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Memo } from '@/types/memo'

export type Database = {
  public: {
    Tables: {
      memos: {
        Row: Memo
        Insert: Omit<Memo, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Memo, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

let supabaseInstance: SupabaseClient<Database> | null = null

const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Server-side에서는 null 반환
    return null
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not found. Using local storage fallback.')
      return null
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

export const supabase = getSupabaseClient()