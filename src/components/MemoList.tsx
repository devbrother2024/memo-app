'use client'

import { Memo, MEMO_CATEGORIES, DEFAULT_CATEGORIES } from '@/types/memo'
import MemoItem from './MemoItem'

interface MemoListProps {
  memos: Memo[]
  loading: boolean
  searchQuery: string
  selectedCategory: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onEditMemo: (memo: Memo) => void
  onDeleteMemo: (id: string) => void
  onViewMemo: (memo: Memo) => void
  stats: {
    total: number
    filtered: number
    byCategory: Record<string, number>
  }
}

export default function MemoList({
  memos,
  loading,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onEditMemo,
  onDeleteMemo,
  onViewMemo,
  stats,
}: MemoListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">메모를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="placeholder-gray-400 text-gray-400 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="메모 검색..."
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={e => onCategoryChange(e.target.value)}
              className="text-gray-400 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">전체 카테고리</option>
              {DEFAULT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {MEMO_CATEGORIES[category]} ({stats.byCategory[category] || 0}
                  )
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            {searchQuery || selectedCategory !== 'all' ? (
              <span>
                {stats.filtered}개 메모 (전체 {stats.total}개 중)
              </span>
            ) : (
              <span>총 {stats.total}개의 메모</span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                onSearchChange('')
                onCategoryChange('all')
              }}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>
      </div>

      {/* 메모 목록 */}
      {memos.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedCategory !== 'all'
              ? '검색 결과가 없습니다'
              : '아직 메모가 없습니다'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all'
              ? '다른 검색어나 카테고리를 시도해보세요.'
              : '첫 번째 메모를 작성해보세요!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memos.map(memo => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onEdit={onEditMemo}
              onDelete={onDeleteMemo}
              onView={onViewMemo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
