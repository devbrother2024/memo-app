import { Tables } from './database'

export interface Memo {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Supabase 데이터베이스 타입을 애플리케이션 타입으로 변환하는 유틸리티
export type DatabaseMemo = Tables<'memos'>

export function convertDatabaseMemoToMemo(dbMemo: DatabaseMemo): Memo {
  return {
    id: dbMemo.id,
    title: dbMemo.title,
    content: dbMemo.content,
    category: dbMemo.category,
    tags: dbMemo.tags || [],
    createdAt: dbMemo.created_at || new Date().toISOString(),
    updatedAt: dbMemo.updated_at || new Date().toISOString(),
  }
}

export function convertMemoToDatabase(memo: Memo): Omit<DatabaseMemo, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: memo.title,
    content: memo.content,
    category: memo.category,
    tags: memo.tags,
  }
}

export interface MemoFormData {
  title: string
  content: string
  category: string
  tags: string[]
}

export type MemoCategory = 'personal' | 'work' | 'study' | 'idea' | 'other'

export const MEMO_CATEGORIES: Record<MemoCategory, string> = {
  personal: '개인',
  work: '업무',
  study: '학습',
  idea: '아이디어',
  other: '기타',
}

export const DEFAULT_CATEGORIES = Object.keys(MEMO_CATEGORIES) as MemoCategory[]
