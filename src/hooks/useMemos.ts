'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Memo, MemoFormData } from '@/types/memo'
import { typedSupabase, dbRowToMemo, memoToDbInsert, memoToDbUpdate } from '@/utils/supabase'

export const useMemos = () => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [mounted, setMounted] = useState(false)

  // 클라이언트 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // 메모 로드
  useEffect(() => {
    if (!mounted) return

    const loadMemos = async () => {
      setLoading(true)
      try {
        const { data, error } = await typedSupabase
          .from('memos')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Failed to load memos:', error)
          return
        }

        const convertedMemos = data.map(dbRowToMemo)
        setMemos(convertedMemos)
      } catch (error) {
        console.error('Failed to load memos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMemos()
  }, [mounted])

  // 메모 생성
  const createMemo = useCallback(async (formData: MemoFormData): Promise<Memo | null> => {
    try {
      const insertData = memoToDbInsert(formData)
      const { data, error } = await typedSupabase
        .from('memos')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Failed to create memo:', error)
        return null
      }

      const newMemo = dbRowToMemo(data)
      setMemos(prev => [newMemo, ...prev])
      return newMemo
    } catch (error) {
      console.error('Failed to create memo:', error)
      return null
    }
  }, [])

  // 메모 업데이트
  const updateMemo = useCallback(
    async (id: string, formData: MemoFormData): Promise<boolean> => {
      try {
        const updateData = memoToDbUpdate(formData)
        const { data, error } = await typedSupabase
          .from('memos')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Failed to update memo:', error)
          return false
        }

        const updatedMemo = dbRowToMemo(data)
        setMemos(prev => prev.map(memo => (memo.id === id ? updatedMemo : memo)))
        return true
      } catch (error) {
        console.error('Failed to update memo:', error)
        return false
      }
    },
    []
  )

  // 메모 삭제
  const deleteMemo = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await typedSupabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Failed to delete memo:', error)
        return false
      }

      setMemos(prev => prev.filter(memo => memo.id !== id))
      return true
    } catch (error) {
      console.error('Failed to delete memo:', error)
      return false
    }
  }, [])

  // 메모 검색
  const searchMemos = useCallback((query: string): void => {
    setSearchQuery(query)
  }, [])

  // 카테고리 필터링
  const filterByCategory = useCallback((category: string): void => {
    setSelectedCategory(category)
  }, [])

  // 특정 메모 가져오기
  const getMemoById = useCallback(
    (id: string): Memo | undefined => {
      return memos.find(memo => memo.id === id)
    },
    [memos]
  )

  // 필터링된 메모 목록
  const filteredMemos = useMemo(() => {
    let filtered = memos

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memo => memo.category === selectedCategory)
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        memo =>
          memo.title.toLowerCase().includes(query) ||
          memo.content.toLowerCase().includes(query) ||
          memo.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [memos, selectedCategory, searchQuery])

  // 모든 메모 삭제
  const clearAllMemos = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await typedSupabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (error) {
        console.error('Failed to clear all memos:', error)
        return false
      }

      setMemos([])
      setSearchQuery('')
      setSelectedCategory('all')
      return true
    } catch (error) {
      console.error('Failed to clear all memos:', error)
      return false
    }
  }, [])

  // 통계 정보
  const stats = useMemo(() => {
    const totalMemos = memos.length
    const categoryCounts = memos.reduce(
      (acc, memo) => {
        acc[memo.category] = (acc[memo.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: totalMemos,
      byCategory: categoryCounts,
      filtered: filteredMemos.length,
    }
  }, [memos, filteredMemos])

  return {
    // 상태
    memos: mounted ? filteredMemos : [],
    allMemos: mounted ? memos : [],
    loading: !mounted || loading,
    searchQuery,
    selectedCategory,
    stats,

    // 메모 CRUD
    createMemo,
    updateMemo,
    deleteMemo,
    getMemoById,

    // 필터링 & 검색
    searchMemos,
    filterByCategory,

    // 유틸리티
    clearAllMemos,
  }
}
