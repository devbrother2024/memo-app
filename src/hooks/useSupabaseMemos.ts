'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Memo, MemoFormData, convertDatabaseMemoToMemo, convertMemoToDatabase, DatabaseMemo } from '@/types/memo'
import { TablesInsert, TablesUpdate } from '@/types/database'

export const useSupabaseMemos = () => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 메모 로드
  const loadMemos = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading memos:', error)
        return
      }

      const convertedMemos = data?.map(convertDatabaseMemoToMemo) || []
      setMemos(convertedMemos)
    } catch (error) {
      console.error('Failed to load memos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 초기 로드
  useEffect(() => {
    loadMemos()
  }, [loadMemos])

  // 메모 생성
  const createMemo = useCallback(async (formData: MemoFormData): Promise<Memo | null> => {
    try {
      const insertData: TablesInsert<'memos'> = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      }

      const { data, error } = await supabase
        .from('memos')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error creating memo:', error)
        return null
      }

      const newMemo = convertDatabaseMemoToMemo(data)
      setMemos(prev => [newMemo, ...prev])
      return newMemo
    } catch (error) {
      console.error('Failed to create memo:', error)
      return null
    }
  }, [])

  // 메모 업데이트
  const updateMemo = useCallback(async (id: string, formData: MemoFormData): Promise<boolean> => {
    try {
      const updateData: TablesUpdate<'memos'> = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      }

      const { data, error } = await supabase
        .from('memos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating memo:', error)
        return false
      }

      const updatedMemo = convertDatabaseMemoToMemo(data)
      setMemos(prev => prev.map(memo => (memo.id === id ? updatedMemo : memo)))
      return true
    } catch (error) {
      console.error('Failed to update memo:', error)
      return false
    }
  }, [])

  // 메모 삭제
  const deleteMemo = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo:', error)
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
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 레코드 삭제

      if (error) {
        console.error('Error clearing all memos:', error)
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
    memos: filteredMemos,
    allMemos: memos,
    loading,
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
    loadMemos, // 새로 추가: 수동으로 데이터 다시 로드
  }
}