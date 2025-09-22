'use client'

import { Memo, MEMO_CATEGORIES } from '@/types/memo'

interface MemoItemProps {
  memo: Memo
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => void
  onView: (memo: Memo) => void
}

export default function MemoItem({
  memo,
  onEdit,
  onDelete,
  onView,
}: MemoItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      idea: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onView(memo)}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {memo.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(memo.category)}`}
            >
              {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] ||
                memo.category}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(memo.updatedAt)}
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={e => {
              e.stopPropagation()
              onEdit(memo)
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="편집"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
                onDelete(memo.id)
              }
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 내용 */}
      <div className="mb-4">
        <div className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {memo.content
            .replace(/^#{1,6}\s+/gm, '') // 제목 마크다운 제거
            .replace(/\*\*(.*?)\*\*/g, '$1') // 굵은 글씨 마크다운 제거
            .replace(/\*(.*?)\*/g, '$1') // 기울임 마크다운 제거
            .replace(/`(.*?)`/g, '$1') // 인라인 코드 마크다운 제거
            .replace(/^\s*[-*+]\s+/gm, '• ') // 목록 마크다운을 bullet으로 변경
            .replace(/^\s*\d+\.\s+/gm, '• ') // 번호 목록을 bullet으로 변경
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 마크다운 제거
            .replace(/```[\s\S]*?```/g, '[코드 블록]') // 코드 블록을 텍스트로 변경
            .replace(/\n{2,}/g, ' ') // 여러 줄바꿈을 공백으로 변경
            .trim()
            .substring(0, 150)}
          {memo.content.length > 150 && '...'}
        </div>
      </div>

      {/* AI 요약 */}
      {memo.aiSummary && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-xs font-medium text-blue-700">AI 요약</span>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed line-clamp-2">
            {memo.aiSummary}
          </p>
        </div>
      )}

      {/* 태그 */}
      {memo.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {memo.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
