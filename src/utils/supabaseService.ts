import { supabase } from '@/lib/supabase'
import { Memo, MemoFormData } from '@/types/memo'

export const supabaseService = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching memos:', error)
        throw error
      }

      // 데이터베이스 컬럼명을 Memo 인터페이스 형식으로 변환
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))
    } catch (error) {
      console.error('Error in getMemos:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (memo: Memo): Promise<Memo> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .insert({
          id: memo.id,
          title: memo.title,
          content: memo.content,
          category: memo.category,
          tags: memo.tags,
          created_at: memo.createdAt,
          updated_at: memo.updatedAt,
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding memo:', error)
        throw error
      }

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
      console.error('Error in addMemo:', error)
      throw error
    }
  },

  // 메모 업데이트
  updateMemo: async (updatedMemo: Memo): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .update({
          title: updatedMemo.title,
          content: updatedMemo.content,
          category: updatedMemo.category,
          tags: updatedMemo.tags,
          updated_at: updatedMemo.updatedAt,
        })
        .eq('id', updatedMemo.id)

      if (error) {
        console.error('Error updating memo:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in updateMemo:', error)
      throw error
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteMemo:', error)
      throw error
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null
        }
        console.error('Error fetching memo by id:', error)
        throw error
      }

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
      console.error('Error in getMemoById:', error)
      return null
    }
  },

  // 모든 메모 삭제
  clearMemos: async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (error) {
        console.error('Error clearing memos:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in clearMemos:', error)
      throw error
    }
  },

  // 메모 검색 (제목, 내용, 태그로 검색)
  searchMemos: async (query: string): Promise<Memo[]> => {
    try {
      if (!query.trim()) {
        return await supabaseService.getMemos()
      }

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching memos:', error)
        throw error
      }

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))
    } catch (error) {
      console.error('Error in searchMemos:', error)
      return []
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    try {
      if (category === 'all') {
        return await supabaseService.getMemos()
      }

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching memos by category:', error)
        throw error
      }

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        category: item.category,
        tags: item.tags || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))
    } catch (error) {
      console.error('Error in getMemosByCategory:', error)
      return []
    }
  },
}