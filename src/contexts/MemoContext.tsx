'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useSupabaseMemos } from '@/hooks/useSupabaseMemos'
import { Memo, MemoFormData } from '@/types/memo'

interface MemoContextType {
  // 상태
  memos: Memo[]
  allMemos: Memo[]
  loading: boolean
  searchQuery: string
  selectedCategory: string
  stats: {
    total: number
    byCategory: Record<string, number>
    filtered: number
  }

  // 메모 CRUD
  createMemo: (formData: MemoFormData) => Promise<Memo | null>
  updateMemo: (id: string, formData: MemoFormData) => Promise<boolean>
  deleteMemo: (id: string) => Promise<boolean>
  getMemoById: (id: string) => Memo | undefined

  // 필터링 & 검색
  searchMemos: (query: string) => void
  filterByCategory: (category: string) => void

  // 유틸리티
  clearAllMemos: () => Promise<boolean>
  loadMemos: () => Promise<void>
}

const MemoContext = createContext<MemoContextType | undefined>(undefined)

interface MemoProviderProps {
  children: ReactNode
}

export function MemoProvider({ children }: MemoProviderProps) {
  const memoHook = useSupabaseMemos()

  return (
    <MemoContext.Provider value={memoHook}>
      {children}
    </MemoContext.Provider>
  )
}

export function useMemoContext(): MemoContextType {
  const context = useContext(MemoContext)
  if (context === undefined) {
    throw new Error('useMemoContext must be used within a MemoProvider')
  }
  return context
}

// 기존 useMemos 훅과 호환성을 위한 별칭
export const useMemos = useMemoContext