import { createClient } from '@/lib/supabase'
import { Memo } from '@/types/memo'

export const supabaseUtils = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching memos:', error)
        return []
      }

      // DB 필드명을 클라이언트 인터페이스에 맞게 변환
      return data.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        category: memo.category,
        tags: memo.tags || [],
        createdAt: memo.created_at,
        updatedAt: memo.updated_at,
      }))
    } catch (error) {
      console.error('Error loading memos from database:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memo | null> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('memos')
        .insert([{
          title: memo.title,
          content: memo.content,
          category: memo.category,
          tags: memo.tags,
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding memo:', error)
        return null
      }

      // DB 필드명을 클라이언트 인터페이스에 맞게 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error adding memo to database:', error)
      return null
    }
  },

  // 메모 업데이트
  updateMemo: async (id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Memo | null> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('memos')
        .update({
          ...(updates.title && { title: updates.title }),
          ...(updates.content && { content: updates.content }),
          ...(updates.category && { category: updates.category }),
          ...(updates.tags && { tags: updates.tags }),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating memo:', error)
        return null
      }

      // DB 필드명을 클라이언트 인터페이스에 맞게 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error updating memo in database:', error)
      return null
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<boolean> => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting memo from database:', error)
      return false
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching memo by id:', error)
        return null
      }

      // DB 필드명을 클라이언트 인터페이스에 맞게 변환
      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error('Error fetching memo by id from database:', error)
      return null
    }
  },

  // 모든 메모 삭제
  clearAllMemos: async (): Promise<boolean> => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '') // 모든 레코드 삭제

      if (error) {
        console.error('Error clearing all memos:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error clearing all memos from database:', error)
      return false
    }
  },
}