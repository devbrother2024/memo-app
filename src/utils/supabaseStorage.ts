import { supabase } from '@/lib/supabase'
import { Memo, MemoFormData } from '@/types/memo'

export const supabaseStorage = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading memos from Supabase:', error)
        return []
      }

      return data
    } catch (error) {
      console.error('Error loading memos from Supabase:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (memoData: MemoFormData): Promise<Memo | null> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .insert([{
          title: memoData.title,
          content: memoData.content,
          category: memoData.category,
          tags: memoData.tags
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding memo to Supabase:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error adding memo to Supabase:', error)
      return null
    }
  },

  // 메모 업데이트
  updateMemo: async (id: string, memoData: MemoFormData): Promise<Memo | null> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .update({
          title: memoData.title,
          content: memoData.content,
          category: memoData.category,
          tags: memoData.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating memo in Supabase:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating memo in Supabase:', error)
      return null
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return false
    }

    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo from Supabase:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting memo from Supabase:', error)
      return false
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching memos in Supabase:', error)
        return []
      }

      return data
    } catch (error) {
      console.error('Error searching memos in Supabase:', error)
      return []
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return []
    }

    try {
      if (category === 'all') {
        return await supabaseStorage.getMemos()
      }

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error filtering memos by category in Supabase:', error)
        return []
      }

      return data
    } catch (error) {
      console.error('Error filtering memos by category in Supabase:', error)
      return []
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return null
    }

    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error getting memo by ID from Supabase:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting memo by ID from Supabase:', error)
      return null
    }
  },

  // 모든 메모 삭제 (개발용)
  clearMemos: async (): Promise<boolean> => {
    if (!supabase) {
      console.warn('Supabase client not available')
      return false
    }

    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 메모 삭제

      if (error) {
        console.error('Error clearing memos from Supabase:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error clearing memos from Supabase:', error)
      return false
    }
  },
}