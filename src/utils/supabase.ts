import { createClient } from '@supabase/supabase-js'
import { Memo } from '@/types/memo'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better type safety
export interface Database {
  public: {
    Tables: {
      memos: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Type-safe Supabase client
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to convert database row to Memo type
export const dbRowToMemo = (row: Database['public']['Tables']['memos']['Row']): Memo => ({
  id: row.id,
  title: row.title,
  content: row.content,
  category: row.category,
  tags: row.tags,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

// Helper function to convert Memo to database insert
export const memoToDbInsert = (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>): Database['public']['Tables']['memos']['Insert'] => ({
  title: memo.title,
  content: memo.content,
  category: memo.category,
  tags: memo.tags,
})

// Helper function to convert Memo to database update
export const memoToDbUpdate = (memo: Partial<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>>): Database['public']['Tables']['memos']['Update'] => ({
  title: memo.title,
  content: memo.content,
  category: memo.category,
  tags: memo.tags,
})
