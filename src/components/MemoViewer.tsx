'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Memo, MEMO_CATEGORIES } from '@/types/memo'

// MarkdownPreview를 동적으로 로드 (SSR 방지)
const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
)

interface MemoViewerProps {
  isOpen: boolean
  memo: Memo | null
  onClose: () => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => Promise<boolean>
}

export default function MemoViewer({
  isOpen,
  memo,
  onClose,
  onEdit,
  onDelete,
}: MemoViewerProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !memo) return null

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleOverlayClick = () => onClose()
  const stopPropagation: React.MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={stopPropagation}
      >
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {memo.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] ||
                    memo.category}
                </span>
                <span>수정: {formatDateTime(memo.updatedAt)}</span>
                <span className="text-gray-400">·</span>
                <span>생성: {formatDateTime(memo.createdAt)}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="닫기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <div className="prose prose-gray max-w-none">
              <MarkdownPreview 
                source={memo.content} 
                style={{ whiteSpace: 'pre-wrap', padding: '16px', backgroundColor: '#ffffff' }}
                data-color-mode="light"
              />
            </div>
          </div>

          {/* 태그 */}
          {memo.tags.length > 0 && (
            <div className="mb-6 flex gap-2 flex-wrap">
              {memo.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => onEdit(memo)}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              편집
            </button>
            <button
              onClick={async () => {
                if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
                  const success = await onDelete(memo.id)
                  if (success) {
                    onClose()
                  }
                }
              }}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

