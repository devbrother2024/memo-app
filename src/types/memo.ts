export interface Memo {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
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

export const DEFAULT_CATEGORIES: MemoCategory[] = [
  'personal',
  'work',
  'study',
  'idea',
  'other',
]
