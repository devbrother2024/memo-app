import { Memo, MemoFormData } from '@/types/memo'
import { supabaseStorage } from './supabaseStorage'
import { localStorageUtils } from './localStorage'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

/**
 * 스토리지 어댑터 - Supabase와 localStorage를 통합 관리
 * Supabase가 사용 가능하면 Supabase를, 그렇지 않으면 localStorage를 사용
 */
export const storageAdapter = {
  // Supabase 사용 가능 여부 확인
  isSupabaseAvailable: (): boolean => {
    return supabase !== null
  },

  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.getMemos()
    } else {
      return localStorageUtils.getMemos()
    }
  },

  // 메모 추가
  addMemo: async (memoData: MemoFormData): Promise<Memo | null> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.addMemo(memoData)
    } else {
      // 로컬 스토리지용 새 메모 생성
      const newMemo: Memo = {
        id: uuidv4(),
        title: memoData.title,
        content: memoData.content,
        category: memoData.category,
        tags: memoData.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      localStorageUtils.addMemo(newMemo)
      return newMemo
    }
  },

  // 메모 업데이트
  updateMemo: async (id: string, memoData: MemoFormData): Promise<Memo | null> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.updateMemo(id, memoData)
    } else {
      // 기존 메모 찾기
      const existingMemo = localStorageUtils.getMemoById(id)
      if (!existingMemo) {
        return null
      }

      // 업데이트된 메모 생성
      const updatedMemo: Memo = {
        ...existingMemo,
        title: memoData.title,
        content: memoData.content,
        category: memoData.category,
        tags: memoData.tags,
        updated_at: new Date().toISOString(),
      }

      localStorageUtils.updateMemo(updatedMemo)
      return updatedMemo
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<boolean> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.deleteMemo(id)
    } else {
      localStorageUtils.deleteMemo(id)
      return true
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.searchMemos(query)
    } else {
      return localStorageUtils.searchMemos(query)
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.getMemosByCategory(category)
    } else {
      return localStorageUtils.getMemosByCategory(category)
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.getMemoById(id)
    } else {
      return localStorageUtils.getMemoById(id)
    }
  },

  // 모든 메모 삭제
  clearMemos: async (): Promise<boolean> => {
    if (storageAdapter.isSupabaseAvailable()) {
      return await supabaseStorage.clearMemos()
    } else {
      localStorageUtils.clearMemos()
      return true
    }
  },

  // 현재 사용 중인 스토리지 타입 반환
  getStorageType: (): 'supabase' | 'localStorage' => {
    return storageAdapter.isSupabaseAvailable() ? 'supabase' : 'localStorage'
  },
}